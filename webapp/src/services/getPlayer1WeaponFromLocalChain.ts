import { ethers } from "ethers";
import { RPS_ABI } from "../constants/contractData";
import { Weapon } from "../constants/types";

async function getPlayer1WeaponFromLocalChain(
  provider: ethers.BrowserProvider | ethers.AbstractProvider | null,
  addressOfContract: string,
): Promise<Weapon> {
  let weapon: Weapon = Weapon.Null;

  if (provider) {
    const selector = ethers.FunctionFragment.getSelector("solve", [
      "uint8",
      "uint256",
    ]); // '0xa5ddec7c'

    try {
      const latestBlock = await provider.getBlockNumber();
      console.log("Checking blocks between 0 and", latestBlock);

      // * Get all transactions to our contract across all blocks * //
      // TODO: Create getPlayer1WeaponFromEtherscan. Works well enough with
      //       Sepolia for now.
      // Inefficient brute force. Only for local use!
      // See getPlayer1WeaponFromEtherscan for production.
      const txns = [];
      for (let i = 0; i <= latestBlock; i++) {
        const block = await provider.getBlock(i, true);
        if (block?.transactions) {
          const blockTxns = block.transactions.map((tx) =>
            provider.getTransaction(tx),
          );
          const transactions = await Promise.all(blockTxns);
          
          // Filter for transactions to our contract
          const contractTxns = transactions.filter(
            (tx) =>
              tx && tx.to?.toLowerCase() === addressOfContract.toLowerCase(),
          );
          txns.push(...contractTxns);
        }
      }

      // Find the solve transaction (it starts with the solve function selector)
      const solveTx = txns.find((tx) => tx && tx.data.startsWith(selector));
      if (solveTx) {
        console.log("Found solve transaction:", solveTx);
        const iFace = new ethers.Interface(RPS_ABI);
        const decodedData = iFace.decodeFunctionData("solve", solveTx.data);
        console.log("Decoded solve data:", decodedData);
        weapon = decodedData[0];
      } else {
        console.log("No solve transaction found. Player 1 may have never revealed the results. Player 2 may have never played. Or there may have been an unexpected error.");
      }
    } catch (error) {
      console.error("Error getting Player 1's weapon:", error);
    }
  } else {
    console.error("Provider not found");
  }

  return weapon;
}

export default getPlayer1WeaponFromLocalChain;