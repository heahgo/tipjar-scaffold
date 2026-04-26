# TipJar — Scaffold-ETH 2 스타일 프로젝트

## 프로젝트 구조

```
packages/
├── hardhat/          # 스마트 컨트랙트
│   ├── contracts/    TipJar.sol
│   ├── deploy/       00_deploy_tipjar.ts
│   └── test/         TipJar.test.ts
└── nextjs/           # 프론트엔드 (Next.js 14 + RainbowKit)
    ├── app/          page.tsx, layout.tsx
    ├── components/   Stats, TipForm, TipHistory, OwnerPanel
    ├── hooks/        useTipJar.ts
    └── contracts/    deployedContracts.ts, wagmi.ts
```

---

## 1단계: 컨트랙트 배포

### 환경 설정

```bash
cd packages/hardhat
cp .env.example .env
# .env 파일에 아래 값 입력:
# DEPLOYER_PRIVATE_KEY=0x...
# ETHERSCAN_API_KEY=...
# SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/...
```

### 의존성 설치 및 배포

```bash
npm install

# 로컬 테스트
npx hardhat node          # 터미널 1
npx hardhat deploy        # 터미널 2

# Sepolia 배포
npx hardhat deploy --network sepolia

# 컨트랙트 verify
npx hardhat etherscan-verify --network sepolia
```

### 배포 후 작업

배포 완료 후 출력된 컨트랙트 주소를 복사하여:

`packages/nextjs/contracts/deployedContracts.ts` 에서 수정:
```ts
address: "0xYOUR_CONTRACT_ADDRESS_HERE"
```

---

## 2단계: 프론트엔드 실행

### 환경 설정

```bash
cd packages/nextjs
```

`contracts/wagmi.ts`에서 WalletConnect Project ID 입력:
```ts
projectId: "YOUR_WALLETCONNECT_PROJECT_ID"
// https://cloud.walletconnect.com 에서 무료 발급
```

### 실행

```bash
npm install
npm run dev    # http://localhost:3000
```

### 빌드 및 배포

```bash
npm run build

# Vercel 배포
npx vercel --prod
```

---

## 테스트

```bash
cd packages/hardhat
npx hardhat test
```

---

## 구현 기능

| 기능 | 설명 |
|------|------|
| 지갑 연결 | RainbowKit (MetaMask, WalletConnect 등) |
| 팁 보내기 | 금액 + 메시지 |
| 통계 | 잔액, 총 수령액, 횟수, 최다 기부자 |
| 팁 내역 | 전체 내역 최신순 |
| 출금 | owner 전용 |
| 최소 팁 설정 | owner 전용 |
| 소유권 이전 | owner 전용 |

---

## wagmi 버전과의 차이점

| 항목 | wagmi+viem | scaffold-eth 스타일 |
|------|-----------|-------------------|
| 지갑 UI | 커스텀 버튼 | RainbowKit 컴포넌트 |
| 컨트랙트 관리 | 수동 ABI | deployedContracts.ts |
| 컨트랙트 배포 | Remix | Hardhat + hardhat-deploy |
| 테스트 | 없음 | Hardhat 테스트 포함 |
| 프레임워크 | Vite + React | Next.js 14 (App Router) |
| 훅 추상화 | 직접 wagmi 훅 | useTipJar 커스텀 훅 |
