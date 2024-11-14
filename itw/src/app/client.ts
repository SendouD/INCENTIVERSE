import { createThirdwebClient } from "thirdweb";
import { hardhat } from "thirdweb/chains";
import { arbitrumSepolia } from "thirdweb/chains";
import {
  sendTransaction,
  getContract,
  prepareContractCall,
} from "thirdweb";
// Replace this with your client ID string
// refer to https://portal.thirdweb.com/typescript/v5/client on how to get a client ID
const clientId = "d4be23f386dcbd6fd7c7d2d4c73c668d";
const chain=arbitrumSepolia;
if (!clientId) {
  throw new Error("No client ID provided");
}

const client = createThirdwebClient({
  clientId: clientId,
});
const contract = getContract({
  address: "0x40fC681E876a143Ec7358E74f75a9ED717B1fec1",
  chain: chain,
  client,
});
export {client,chain,contract}

// 0x40fC681E876a143Ec7358E74f75a9ED717B1fec1