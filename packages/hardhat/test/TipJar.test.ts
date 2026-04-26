import { expect } from "chai";
import { ethers } from "hardhat";
import { parseEther, formatEther } from "ethers";

describe("TipJar", function () {
  async function deployFixture() {
    const [owner, tipper1, tipper2] = await ethers.getSigners();
    const minTip = parseEther("0.001");

    const TipJar = await ethers.getContractFactory("TipJar");
    const tipJar = await TipJar.deploy(minTip);
    await tipJar.waitForDeployment();

    return { tipJar, owner, tipper1, tipper2, minTip };
  }

  it("올바른 owner와 minTip으로 배포", async function () {
    const { tipJar, owner, minTip } = await deployFixture();
    expect(await tipJar.owner()).to.equal(owner.address);
    expect(await tipJar.minTip()).to.equal(minTip);
  });

  it("tip() 함수로 팁 전송 및 이벤트 발생", async function () {
    const { tipJar, tipper1 } = await deployFixture();
    const amount = parseEther("0.01");

    await expect(
      tipJar.connect(tipper1).tip("안녕하세요!", { value: amount })
    )
      .to.emit(tipJar, "TipReceived")
      .withArgs(tipper1.address, amount, "안녕하세요!");

    expect(await tipJar.getBalance()).to.equal(amount);
    expect(await tipJar.getTipCount()).to.equal(1n);
  });

  it("minTip 미만 전송 시 revert", async function () {
    const { tipJar, tipper1 } = await deployFixture();
    await expect(
      tipJar.connect(tipper1).tip("test", { value: parseEther("0.0001") })
    ).to.be.revertedWithCustomError(tipJar, "BelowMinTip");
  });

  it("getTipHistory로 내역 조회", async function () {
    const { tipJar, tipper1 } = await deployFixture();
    await tipJar.connect(tipper1).tip("첫 번째 팁", { value: parseEther("0.001") });
    await tipJar.connect(tipper1).tip("두 번째 팁", { value: parseEther("0.002") });

    const history = await tipJar.getTipHistory();
    expect(history.length).to.equal(2);
    expect(history[0].message).to.equal("첫 번째 팁");
    expect(history[1].message).to.equal("두 번째 팁");
  });

  it("topTipper 추적", async function () {
    const { tipJar, tipper1, tipper2 } = await deployFixture();
    await tipJar.connect(tipper1).tip("", { value: parseEther("0.005") });
    await tipJar.connect(tipper2).tip("", { value: parseEther("0.01") });

    expect(await tipJar.topTipper()).to.equal(tipper2.address);
  });

  it("owner만 withdrawTips 가능", async function () {
    const { tipJar, owner, tipper1 } = await deployFixture();
    await tipJar.connect(tipper1).tip("", { value: parseEther("0.01") });

    await expect(
      tipJar.connect(tipper1).withdrawTips()
    ).to.be.revertedWithCustomError(tipJar, "NotOwner");

    await expect(tipJar.connect(owner).withdrawTips())
      .to.emit(tipJar, "TipWithdrawn");

    expect(await tipJar.getBalance()).to.equal(0n);
  });

  it("owner만 setMinTip 가능", async function () {
    const { tipJar, owner, tipper1 } = await deployFixture();
    const newMin = parseEther("0.005");

    await expect(
      tipJar.connect(tipper1).setMinTip(newMin)
    ).to.be.revertedWithCustomError(tipJar, "NotOwner");

    await tipJar.connect(owner).setMinTip(newMin);
    expect(await tipJar.minTip()).to.equal(newMin);
  });

  it("transferOwnership 동작", async function () {
    const { tipJar, owner, tipper1 } = await deployFixture();
    await tipJar.connect(owner).transferOwnership(tipper1.address);
    expect(await tipJar.owner()).to.equal(tipper1.address);
  });
});
