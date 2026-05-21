"use client";

import { useState } from "react";
import type { Locale } from "@/lib/types";

type WalletProviderName = "metamask" | "bnb";

type EthereumProvider = {
  isMetaMask?: boolean;
  request(args: { method: string; params?: unknown[] }): Promise<unknown>;
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

export function WalletConnectPanel({ locale = "zh", inputName = "walletAddress" }: { locale?: Locale; inputName?: string }) {
  const [walletAddress, setWalletAddress] = useState("");
  const [status, setStatus] = useState("");
  const [isConnecting, setIsConnecting] = useState<WalletProviderName | null>(null);

  async function connect(providerName: WalletProviderName) {
    const provider = getProvider(providerName);
    const label = providerLabel(providerName);

    if (!provider) {
      setStatus(locale === "zh" ? `未检测到 ${label}。请先安装或打开钱包扩展。` : `${label} was not detected. Install or open the wallet extension first.`);
      return;
    }

    setIsConnecting(providerName);
    setStatus(locale === "zh" ? `正在连接 ${label}...` : `Connecting ${label}...`);

    try {
      await switchToBnbSmartChain(provider);
      const accounts = await provider.request({ method: "eth_requestAccounts" });
      const address = accountFromResult(accounts);

      if (!address) {
        setStatus(locale === "zh" ? "钱包没有返回地址，请重新授权。" : "The wallet did not return an address. Please authorize again.");
        return;
      }

      setWalletAddress(address);
      setStatus(locale === "zh" ? `${label} 已连接，并已切换至 BNB Smart Chain。` : `${label} connected and switched to BNB Smart Chain.`);
    } catch (error) {
      setStatus(
        locale === "zh"
          ? `钱包连接未完成：${error instanceof Error ? error.message : "请检查钱包授权。"}`
          : `Wallet connection was not completed: ${error instanceof Error ? error.message : "check wallet authorization."}`,
      );
    } finally {
      setIsConnecting(null);
    }
  }

  return (
    <div className="block">
      <span className="text-[11px] uppercase tracking-[0.18em] text-[var(--ash)]">
        {locale === "zh" ? "付款钱包地址" : "Payer Wallet"}
      </span>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {(["metamask", "bnb"] as const).map((providerName) => (
          <button
            key={providerName}
            type="button"
            onClick={() => connect(providerName)}
            disabled={Boolean(isConnecting)}
            className="focus-ring min-h-11 border border-black/14 px-3 py-2 text-[11px] uppercase tracking-[0.12em] text-black transition hover:border-black disabled:cursor-wait disabled:opacity-55"
          >
            {isConnecting === providerName
              ? locale === "zh"
                ? "连接中"
                : "Connecting"
              : locale === "zh"
                ? `连接 ${providerLabel(providerName)}`
                : `Connect ${providerLabel(providerName)}`}
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
      <p className="mt-2 min-h-5 text-xs leading-5 text-[var(--ash)]">{status || (locale === "zh" ? "可自动连接，也可手动粘贴付款钱包地址。" : "Connect automatically or paste the payer wallet manually.")}</p>
    </div>
  );
}
