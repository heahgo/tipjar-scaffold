// ⚠️ 이 파일은 `yarn deploy --network sepolia` 실행 후 자동으로 업데이트됩니다.
// 수동으로 배포한 경우 아래 address와 ABI를 직접 교체하세요.

const deployedContracts = {
  11155111: {  // Sepolia chainId
    TipJar: {
      address: "0xf9b4aaE1E30b94da7Bb0AbF990EFa43c1BD127C5" as `0x${string}`,
      abi: [
        {
          name: "tip",
          type: "function",
          stateMutability: "payable",
          inputs: [{ name: "message", type: "string" }],
          outputs: [],
        },
        {
          name: "withdrawTips",
          type: "function",
          stateMutability: "nonpayable",
          inputs: [],
          outputs: [],
        },
        {
          name: "setMinTip",
          type: "function",
          stateMutability: "nonpayable",
          inputs: [{ name: "_minTip", type: "uint256" }],
          outputs: [],
        },
        {
          name: "transferOwnership",
          type: "function",
          stateMutability: "nonpayable",
          inputs: [{ name: "newOwner", type: "address" }],
          outputs: [],
        },
        {
          name: "getBalance",
          type: "function",
          stateMutability: "view",
          inputs: [],
          outputs: [{ name: "", type: "uint256" }],
        },
        {
          name: "getTipHistory",
          type: "function",
          stateMutability: "view",
          inputs: [],
          outputs: [
            {
              name: "",
              type: "tuple[]",
              components: [
                { name: "tipper", type: "address" },
                { name: "amount", type: "uint256" },
                { name: "message", type: "string" },
                { name: "timestamp", type: "uint256" },
              ],
            },
          ],
        },
        {
          name: "getTipCount",
          type: "function",
          stateMutability: "view",
          inputs: [],
          outputs: [{ name: "", type: "uint256" }],
        },
        {
          name: "owner",
          type: "function",
          stateMutability: "view",
          inputs: [],
          outputs: [{ name: "", type: "address" }],
        },
        {
          name: "topTipper",
          type: "function",
          stateMutability: "view",
          inputs: [],
          outputs: [{ name: "", type: "address" }],
        },
        {
          name: "topTipAmount",
          type: "function",
          stateMutability: "view",
          inputs: [],
          outputs: [{ name: "", type: "uint256" }],
        },
        {
          name: "totalReceived",
          type: "function",
          stateMutability: "view",
          inputs: [],
          outputs: [{ name: "", type: "uint256" }],
        },
        {
          name: "minTip",
          type: "function",
          stateMutability: "view",
          inputs: [],
          outputs: [{ name: "", type: "uint256" }],
        },
        {
          name: "totalTippedBy",
          type: "function",
          stateMutability: "view",
          inputs: [{ name: "", type: "address" }],
          outputs: [{ name: "", type: "uint256" }],
        },
        {
          name: "TipReceived",
          type: "event",
          inputs: [
            { name: "tipper", type: "address", indexed: true },
            { name: "amount", type: "uint256", indexed: false },
            { name: "message", type: "string", indexed: false },
          ],
        },
        {
          name: "TipWithdrawn",
          type: "event",
          inputs: [
            { name: "owner", type: "address", indexed: true },
            { name: "amount", type: "uint256", indexed: false },
          ],
        },
      ] as const,
    },
  },
} as const;

export default deployedContracts;
