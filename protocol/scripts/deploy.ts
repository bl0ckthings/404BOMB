import hre from "hardhat";

const { ethers } = hre;

async function main() {


  const BOMB404 = await ethers.getContractFactory('TST404');
  const bomb404 = await BOMB404.deploy();

  await bomb404.deployed();

  console.log(`BOMB404 deployed to : ${bomb404.address}`);

  const Mirror404 = await ethers.getContractFactory('Mirror404');
  const mirror404 = await Mirror404.deploy();

  await mirror404.deployed();

  console.log(`Mirror404 deployed to : ${mirror404.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});