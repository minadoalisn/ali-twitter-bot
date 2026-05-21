"use client";

import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/types";

type WalletProviderName = "metamask" | "bnb";

type EthereumProvider = {
  isMetaMask?: boolean;
  request(args: { method: string; params?: unknown[] }): Promise<unknown>;
};

type WalletConnectPanelProps = {
  locale?: Locale;
  inputName?: string;
  txHashInputName?: string;
  amountUsd: number;
  receivingAddress: string;
};

declare global {
  interface Window {
    ethereum?: EthereumProvider;
    BinanceChain?: EthereumProvider;
  }
}

const bnbSmartChain = {
  chainId: "0x38",
  chainName: "BNB Smart Chain",
  nativeCurrency: {
    name: "BNB",
    symbol: "BNB",
    decimals: 18,
  },
  rpcUrls: ["https://bsc-dataseed.binance.org/"],
  blockExplorerUrls: ["https://bscscan.com"],
};

const bscUsdtContract = "0x55d398326f99059fF775485246999027B3197955";
const erc20TransferSelector = "0xa9059cbb";
const tokenDecimals = BigInt("1000000000000000000");

function providerLabel(providerName: WalletProviderName) {
  return providerName === "metamask" ? "MetaMask" : "BNB Wallet";
}

function getProvider(providerName: WalletProviderName) {
  if (typeof window === "undefined") return null;

  if (providerName === "bnb") {
    return window.BinanceChain ?? window.ethereum ?? null;
  }

  return window.ethereum ?? null;
}

function errorCode(error: unknown) {
  return typeof error === "object" && error && "code" in error ? Number((error as { code: unknown }).code) : 0;
}

async function switchToBnbSmartChain(provider: EthereumProvider) {
  try {
    await provider.request({ method: "wallet_switchEthereumChain", params: [{ chainId: bnbSmartChain.chainId }] });
  } catch (error) {
    if (errorCode(error) !== 4902) {
      throw error;
    }

    await provider.request({ method: "wallet_addEthereumChain", params: [bnbSmartChain] });
  }
}

function accountFromResult(result: unknown) {
  if (Array.isArray(result) && typeof result[0] === "string") {
    return result[0];
  }

  return "";
}

function normalizeAddress(address: string) {
  const cleanAddress = address.trim();

  if (!/^0x[a-fA-F0-9]{40}$/.test(cleanAddress)) {
    throw new Error("Invalid BEP-20 receiving address.");
  }

  return cleanAddress.toLowerCase().replace(/^0x/, "").padStart(64, "0");
}

function parseTokenAmount(amountUsd: number) {
  if (!Number.isFinite(amountUsd) || amountUsd <= 0) {
    throw new Error("Invalid payment amount.");
  }

  const [whole = "0", fraction = ""] = String(amountUsd).replace(/,/g, "").split(".");

  if (!/^\d+$/.test(whole) || !/^\d*$/.test(fraction)) {
    throw new Error("Invalid payment amount.");
  }

  const normalizedFraction = `${fraction}${"0".repeat(18)}`.slice(0, 18);
  return BigInt(whole) * tokenDecimals + BigInt(normalizedFraction || "0");
}

function encodeUsdtTransfer(to: string, amount: bigint) {
  const encodedTo = normalizeAddress(to);
  const encodedAmount = amount.toString(16).padStart(64, "0");

  return `${erc20TransferSelector}${encodedTo}${encodedAmount}`;
}

async function sendUsdtPayment({
  provider,
  from,
  amountUsd,
  receivingAddress,
}: {
  provider: EthereumProvider;
  from: string;
  amountUsd: number;
  receivingAddress: string;
}) {
  const transactionHash = await provider.request({
    method: "eth_sendTransaction",
    params: [
      {
        from,
        to: bscUsdtContract,
        value: "0x0",
        data: encodeUsdtTransfer(receivingAddress, parseTokenAmount(amountUsd)),
      },
    ],
  });

  if (typeof transactionHash !== "string" || !transactionHash.startsWith("0x")) {
    throw new Error("Wallet did not return a transaction hash.");
  }

  return transactionHash;
}

function paymentPrompt(locale: Locale, providerName: WalletProviderName) {
  const label = providerLabel(providerName);

  return locale === "zh" ? `连接 ${label} 并支付` : `Pay With ${label}`;
}

export function WalletConnectPanel({
  locale = "zh",
  inputName = "walletAddress",
  txHashInputName = "txHash",
  amountUsd,
  receivingAddress,
}: WalletConnectPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [walletAddress, setWalletAddress] = useState("");
  const [txHash, setTxHash] = useState("");
  const [status, setStatus] = useState("");
  const [activeProvider, setActiveProvider] = useState<WalletProviderName | null>(null);

  useEffect(() => {
    const form = panelRef.current?.closest("form");
    if (!form) return undefined;

    function handleSubmit(event: Event) {
      if (txHash) return;

      event.preventDefault();
      setStatus(
        locale === "zh"
          ? "请先点击钱包按钮完成 BEP-20 USDT 转账，钱包返回链上凭证后再提交后台确认。"
          : "Pay with a wallet first. After the wallet returns the on-chain proof, submit for admin review.",
      );
    }

    form.addEventListener("submit", handleSubmit);
    return () => form.removeEventListener("submit", handleSubmit);
  }, [locale, txHash]);

  async function payWithWallet(providerName: WalletProviderName) {
    const provider = getProvider(providerName);
    const label = providerLabel(providerName);

    if (!provider) {
      setStatus(locale === "zh" ? `未检测到 ${label}。请先安装或打开钱包扩展。` : `${label} was not detected. Install or open the wallet extension first.`);
      return;
    }

    setActiveProvider(providerName);
    setTxHash("");
    setStatus(locale === "zh" ? `正在连接 ${label} 并切换到 BNB Smart Chain...` : `Connecting ${label} and switching to BNB Smart Chain...`);

    try {
      await switchToBnbSmartChain(provider);
      const accounts = await provider.request({ method: "eth_requestAccounts" });
      const address = accountFromResult(accounts);

      if (!address) {
        setStatus(locale === "zh" ? "钱包没有返回地址，请重新授权。" : "The wallet did not return an address. Please authorize again.");
        return;
      }

      setWalletAddress(address);
      setStatus(locale === "zh" ? "请在钱包中确认 BEP-20 USDT 转账。" : "Confirm the BEP-20 USDT transfer in your wallet.");

      const nextTxHash = await sendUsdtPayment({ provider, from: address, amountUsd, receivingAddress });

      setTxHash(nextTxHash);
      setStatus(
        locale === "zh"
          ? "钱包已返回链上交易凭证，可提交后台确认。"
          : "Wallet returned the on-chain transaction proof; submit for admin review.",
      );
    } catch (error) {
      setStatus(
        locale === "zh"
          ? `钱包支付未完成：${error instanceof Error ? error.message : "请检查授权、USDT 余额与 BNB Gas。"}`
          : `Wallet payment was not completed: ${error instanceof Error ? error.message : "check authorization, USDT balance, and BNB gas."}`,
      );
    } finally {
      setActiveProvider(null);
    }
  }

  return (
    <div ref={panelRef} className="block">
      <span className="text-[11px] uppercase tracking-[0.18em] text-[var(--ash)]">
        {locale === "zh" ? "付款钱包地址" : "Payer Wallet"}
      </span>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {(["metamask", "bnb"] as const).map((providerName) => (
          <button
            key={providerName}
            type="button"
            onClick={() => payWithWallet(providerName)}
            disabled={Boolean(activeProvider)}
            className="focus-ring min-h-11 border border-black/14 px-3 py-2 text-[11px] uppercase tracking-[0.12em] text-black transition hover:border-black disabled:cursor-wait disabled:opacity-55"
          >
            {activeProvider === providerName ? (locale === "zh" ? "等待钱包确认" : "Waiting For Wallet") : paymentPrompt(locale, providerName)}
          </button>
        ))}
      </div>
      <input
        className="mt-3 h-12 w-full border border-black/14 bg-transparent px-4 font-mono text-sm outline-none transition focus:border-[var(--champagne)]"
        name={inputName}
        value={walletAddress}
        onChange={(event) => setWalletAddress(event.target.value)}
        minLength={24}
        maxLength={120}
        required
      />
      <input type="hidden" name={txHashInputName} value={txHash} />
      <p className="mt-2 min-h-5 text-xs leading-5 text-[var(--ash)]">
        {status ||
          (locale === "zh"
            ? "点击钱包按钮会发起 BEP-20 USDT 转账；链上凭证会自动写入后台确认表单。"
            : "Wallet payment starts a BEP-20 USDT transfer; the on-chain proof is added to the review form automatically.")}
      </p>
    </div>
  );
}
