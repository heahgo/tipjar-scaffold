"use client";

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { useAccount } from "wagmi";
import deployedContracts from "../contracts/deployedContracts";

const CONTRACT = deployedContracts[11155111].TipJar;

export function useBalance() {
  return useReadContract({
    address: CONTRACT.address,
    abi: CONTRACT.abi,
    functionName: "getBalance",
  });
}

export function useTipHistory() {
  return useReadContract({
    address: CONTRACT.address,
    abi: CONTRACT.abi,
    functionName: "getTipHistory",
  });
}

export function useTipStats() {
  const balance = useReadContract({ address: CONTRACT.address, abi: CONTRACT.abi, functionName: "getBalance" });
  const totalReceived = useReadContract({ address: CONTRACT.address, abi: CONTRACT.abi, functionName: "totalReceived" });
  const tipCount = useReadContract({ address: CONTRACT.address, abi: CONTRACT.abi, functionName: "getTipCount" });
  const topTipper = useReadContract({ address: CONTRACT.address, abi: CONTRACT.abi, functionName: "topTipper" });
  const topAmount = useReadContract({ address: CONTRACT.address, abi: CONTRACT.abi, functionName: "topTipAmount" });
  const minTip = useReadContract({ address: CONTRACT.address, abi: CONTRACT.abi, functionName: "minTip" });
  const owner = useReadContract({ address: CONTRACT.address, abi: CONTRACT.abi, functionName: "owner" });
  return { balance, totalReceived, tipCount, topTipper, topAmount, minTip, owner };
}

export function useSendTip() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const sendTip = (amount: bigint, message: string) => {
    writeContract({
      address: CONTRACT.address,
      abi: CONTRACT.abi,
      functionName: "tip",
      args: [message],
      value: amount,
    } as any);
  };

  return { sendTip, isPending, isConfirming, isSuccess, error };
}

export function useWithdraw() {
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isSuccess } = useWaitForTransactionReceipt({ hash });

  const withdraw = () => {
    writeContract({
      address: CONTRACT.address,
      abi: CONTRACT.abi,
      functionName: "withdrawTips",
    } as any);
  };

  return { withdraw, isPending, isSuccess };
}

export function useSetMinTip() {
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isSuccess } = useWaitForTransactionReceipt({ hash });

  const setMinTip = (amount: bigint) => {
    writeContract({
      address: CONTRACT.address,
      abi: CONTRACT.abi,
      functionName: "setMinTip",
      args: [amount],
    } as any);
  };

  return { setMinTip, isPending, isSuccess };
}

export function useTransferOwnership() {
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isSuccess } = useWaitForTransactionReceipt({ hash });

  const transferOwnership = (newOwner: `0x${string}`) => {
    writeContract({
      address: CONTRACT.address,
      abi: CONTRACT.abi,
      functionName: "transferOwnership",
      args: [newOwner],
    } as any);
  };

  return { transferOwnership, isPending, isSuccess };
}

export function useIsOwner() {
  const { address } = useAccount();
  const { data: owner } = useReadContract({
    address: CONTRACT.address,
    abi: CONTRACT.abi,
    functionName: "owner",
  });
  return address && owner
    ? address.toLowerCase() === (owner as string).toLowerCase()
    : false;
}