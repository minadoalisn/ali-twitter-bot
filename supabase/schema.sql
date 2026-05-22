create extension if not exists pgcrypto;

create type public.user_role as enum ('buyer', 'admin', 'super_admin');
create type public.auction_status as enum ('draft', 'live', 'sold', 'recycled', 'cancelled');
create type public.payment_status as enum ('pending', 'requires_action', 'paid', 'failed', 'refunded', 'manual_review');
create type public.order_status as enum ('awaiting_payment', 'paid', 'awaiting_shipping_info', 'in_production', 'quality_check', 'shipped', 'delivered', 'cancelled', 'refunded');
create type public.shipment_status as enum ('blocked', 'awaiting_shipping_info', 'release_review', 'insured_logistics', 'shipped', 'delivered', 'aftercare_archived', 'exception_hold');
create type public.inquiry_status as enum ('new', 'contacted', 'qualified', 'converted', 'closed', 'spam');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role public.user_role not null default 'buyer',
  nickname text not null,
  public_name text,
  show_public_name boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.story_series (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  zh_name text not null,
  theme text not null,
  emotional_line text not null,
  materials text[] not null default '{}',
  craft text[] not null default '{}',
  ip_hook text not null default '',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  zh_name text not null,
  active boolean not null default true,
  sort_order int not null default 0
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  story_series_id uuid not null references public.story_series(id),
  category_id uuid not null references public.categories(id),
  serial text unique not null,
  slug text unique not null,
  title text not null,
  zh_title text not null,
  inspiration text not null,
  concept text not null,
  materials text[] not null default '{}',
  craft text[] not null default '{}',
  image_url text,
  status public.auction_status not null default 'draft',
  created_at timestamptz not null default now()
);

create table public.auctions (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id),
  cycle int not null default 1,
  status public.auction_status not null default 'draft',
  start_price_usd numeric(12,2) not null,
  current_price_usd numeric(12,2) not null,
  deposit_usd numeric(12,2) not null,
  bid_increment_usd numeric(12,2) not null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  winner_id uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create table public.bids (
  id uuid primary key default gen_random_uuid(),
  auction_id uuid not null references public.auctions(id),
  bidder_id uuid not null references public.profiles(id),
  amount_usd numeric(12,2) not null,
  payment_id uuid,
  created_at timestamptz not null default now()
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id),
  product_id uuid references public.products(id),
  auction_id uuid references public.auctions(id),
  provider text not null,
  provider_ref text,
  role text not null,
  amount_usd numeric(12,2) not null,
  status public.payment_status not null default 'pending',
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

alter table public.bids
  add constraint bids_payment_fk foreign key (payment_id) references public.payments(id);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  product_id uuid unique not null references public.products(id),
  auction_id uuid unique not null references public.auctions(id),
  buyer_id uuid not null references public.profiles(id),
  status public.order_status not null default 'awaiting_payment',
  total_usd numeric(12,2) not null,
  balance_due_usd numeric(12,2) not null default 0,
  created_at timestamptz not null default now()
);

create table public.shipments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid unique not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id),
  buyer_id uuid not null references public.profiles(id),
  status public.shipment_status not null default 'blocked',
  owner_profile jsonb not null default '{}',
  shipping_address jsonb not null default '{}',
  courier text,
  tracking_number text,
  insured_value_usd numeric(12,2),
  package_evidence_url text,
  delivery_proof_url text,
  aftercare_notes text,
  exception_reason text,
  release_reviewer_id uuid references public.profiles(id),
  shipped_at timestamptz,
  delivered_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.admin_audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id),
  action text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table public.customer_inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  phone text,
  contact_channel text not null,
  contact_handle text,
  intent text not null,
  product_serial text,
  budget_usd numeric(12,2),
  message text not null,
  locale text not null default 'zh',
  page_path text,
  source text not null default 'concierge_widget',
  status public.inquiry_status not null default 'new',
  priority text not null default 'normal',
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index customer_inquiries_created_at_idx on public.customer_inquiries (created_at desc);
create index customer_inquiries_status_idx on public.customer_inquiries (status);
create index customer_inquiries_product_serial_idx on public.customer_inquiries (product_serial);
create index shipments_status_idx on public.shipments (status);
create index shipments_buyer_id_idx on public.shipments (buyer_id);

create or replace function public.place_bid_locked(
  p_auction_id uuid,
  p_bidder_id uuid,
  p_amount_usd numeric,
  p_payment_id uuid
) returns public.bids
language plpgsql
security definer
as $$
declare
  v_auction public.auctions%rowtype;
  v_bid public.bids%rowtype;
begin
  select * into v_auction
  from public.auctions
  where id = p_auction_id
  for update;

  if not found then
    raise exception 'auction_not_found';
  end if;

  if v_auction.status <> 'live' then
    raise exception 'auction_not_live';
  end if;

  if now() > v_auction.ends_at then
    raise exception 'auction_ended';
  end if;

  if p_amount_usd < v_auction.current_price_usd + v_auction.bid_increment_usd then
    raise exception 'bid_too_low';
  end if;

  insert into public.bids (auction_id, bidder_id, amount_usd, payment_id)
  values (p_auction_id, p_bidder_id, p_amount_usd, p_payment_id)
  returning * into v_bid;

  update public.auctions
  set current_price_usd = p_amount_usd
  where id = p_auction_id;

  return v_bid;
end;
$$;

alter table public.profiles enable row level security;
alter table public.story_series enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.auctions enable row level security;
alter table public.bids enable row level security;
alter table public.payments enable row level security;
alter table public.orders enable row level security;
alter table public.shipments enable row level security;
alter table public.admin_audit_logs enable row level security;
alter table public.customer_inquiries enable row level security;

create policy "public can read active catalog" on public.products for select using (true);
create policy "public can read story series" on public.story_series for select using (true);
create policy "public can read categories" on public.categories for select using (true);
create policy "public can read auctions" on public.auctions for select using (true);
create policy "buyers can read own profile" on public.profiles for select using (auth.uid() = id);
create policy "buyers can read own bids" on public.bids for select using (auth.uid() = bidder_id);
create policy "buyers can read own payments" on public.payments for select using (auth.uid() = profile_id);
create policy "buyers can read own orders" on public.orders for select using (auth.uid() = buyer_id);
create policy "buyers can read own shipments" on public.shipments for select using (auth.uid() = buyer_id);
