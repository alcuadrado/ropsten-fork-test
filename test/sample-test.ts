import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { expect } from "chai";
import { Contract, utils } from "ethers";
import { ethers } from "hardhat";

const SwapProxyABI = [
  {
    inputs: [
      {
        internalType: "contract IERC20Ext",
        name: "src",
        type: "address",
      },
      {
        internalType: "contract IERC20Ext",
        name: "dest",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "srcAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "platformFee",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "hint",
        type: "bytes",
      },
    ],
    name: "getExpectedReturnKyber",
    outputs: [
      {
        internalType: "uint256",
        name: "destAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "expectedRate",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const ETH = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";
const DAI = "0xad6d458402f60fd3bd25163575031acdce07538d";
const tradeAmount = utils.parseUnits("1000", "18");

let signer: SignerWithAddress;
let swapProxy: Contract;

describe("Greeter", function () {
  this.timeout(60000);
  before(async function () {
    [signer] = await ethers.getSigners();

    swapProxy = await ethers.getContractAt(
      SwapProxyABI,
      "0x4A0C59CcCae7B4F0732a4A1b9A7BDA49cc1d88F9"
    );
  });

  it("Should return the new greeting once it's changed", async function () {
    const Greeter = await ethers.getContractFactory("Greeter");
    const greeter = await Greeter.deploy("Hello, world!");

    await greeter.deployed();
    expect(await greeter.greet()).to.equal("Hello, world!");

    await greeter.setGreeting("Hola, mundo!");
    expect(await greeter.greet()).to.equal("Hola, mundo!");
  });

  it("Should get expected return from kyber [TIMESOUT WITHIN 60s]", async function () {
    const returnKyber = await swapProxy
      .connect(signer)
      .getExpectedReturnKyber(DAI, ETH, tradeAmount, 8, "0x");

    expect(returnKyber).to.be.ok;
  });

  it("Should get expected return from kyber [INCREASED TIMEOUT WORKS]", async function () {
    const returnKyber = await swapProxy
      .connect(signer)
      .getExpectedReturnKyber(DAI, ETH, tradeAmount, 8, "0x");

    expect(returnKyber).to.be.ok;
  }).timeout(120000);
});
