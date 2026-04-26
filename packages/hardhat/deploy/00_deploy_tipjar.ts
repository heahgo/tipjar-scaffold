import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { parseEther } from "ethers";

const deployTipJar: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  const minTip = parseEther("0.001"); // 0.001 ETH

  await deploy("TipJar", {
    from: deployer,
    args: [minTip],
    log: true,
    autoMine: true,
  });
};

export default deployTipJar;
deployTipJar.tags = ["TipJar"];
