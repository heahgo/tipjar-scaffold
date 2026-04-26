import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { useAccount } from "wagmi";
import deployedContracts from "../contracts/deployedContracts";

const CONTRACT = deployedContracts[11155111].TipJar;

// 공통 read hook
export function useTipJarRead<T>(
  functionName: string,
  args?: readonly unknown[]
) {
  return useReadContract({
    address: CONTRACT.address,
    abi: CONTRACT.abi,
    functionName: functionName as never,
    args: args as never,
  }) as { data: T | undefined; isLoading: boolean; refetch: () => void };
}

// 잔액
export function useBalance() {
  return useTipJarRead<bigint>("getBalance");
}

// 팁 내역
export function useTipHistory() {
  return useTipJarRead<
    Array<{
      tipper: `0x${string}`;
      amount: bigint;
      message: string;
      timestamp: bigint;
    }>
  >("getTipHistory");
}

// 통계
export function useTipStats() {
  const balance = useTipJarRead<bigint>("getBalance");
  const totalReceived = useTipJarRead<bigint>("totalReceived");
  const tipCount = useTipJarRead<bigint>("getTipCount");
  const topTipper = useTipJarRead<`0x${string}`>("topTipper");
  const topAmount = useTipJarRead<bigint>("topTipAmount");
  const minTip = useTipJarRead<bigint>("minTip");
  const owner = useTipJarRead<`0x${string}`>("owner");

  return { balance, totalReceived, tipCount, topTipper, topAmount, minTip, owner };
}

// write: tip
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
    });
  };

  return { sendTip, isPending, isConfirming, isSuccess, error };
}

// write: withdraw
export function useWithdraw() {
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isSuccess } = useWaitForTransactionReceipt({ hash });

  const withdraw = () => {
    writeContract({
      address: CONTRACT.address,
      abi: CONTRACT.abi,
      functionName: "withdrawTips",
    });
  };

  return { withdraw, isPending, isSuccess };
}

// write: setMinTip
export function useSetMinTip() {
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isSuccess } = useWaitForTransactionReceipt({ hash });

  const setMinTip = (amount: bigint) => {
    writeContract({
      address: CONTRACT.address,
      abi: CONTRACT.abi,
      functionName: "setMinTip",
      args: [amount],
    });
  };

  return { setMinTip, isPending, isSuccess };
}

// write: transferOwnership
export function useTransferOwnership() {
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isSuccess } = useWaitForTransactionReceipt({ hash });

  const transferOwnership = (newOwner: `0x${string}`) => {
    writeContract({
      address: CONTRACT.address,
      abi: CONTRACT.abi,
      functionName: "transferOwnership",
      args: [newOwner],
    });
  };

  return { transferOwnership, isPending, isSuccess };
}

// owner 여부 확인
export function useIsOwner() {
  const { address } = useAccount();
  const { data: owner } = useTipJarRead<`0x${string}`>("owner");
  return address && owner
    ? address.toLowerCase() === owner.toLowerCase()
    : false;
}
