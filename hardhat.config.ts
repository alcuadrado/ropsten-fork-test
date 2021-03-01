import { HardhatUserConfig } from "hardhat/types";
import assert from "assert";

import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + "/.env" });

import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-waffle";

const ALCHEMY_ID = process.env.ALCHEMY_ID;
assert.ok(ALCHEMY_ID, "no ALCHEMY_ID in process.env");

const config: HardhatUserConfig = {
  networks: {
    hardhat: {
      forking: {
        url: `https://eth-ropsten.alchemyapi.io/v2/${ALCHEMY_ID}`,
        blockNumber: 9729150,
      },
    },
  },
  solidity: {
    compilers: [
      {
        version: "0.7.0",
        settings: {
          optimizer: { enabled: true },
        },
      },
    ],
  },
};
export default config;
