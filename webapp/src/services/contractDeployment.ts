import { ethers } from "ethers";
import { Player1Choices, StoredGameSecret, Weapon } from "../constants/types";
import { RPS_ABI, RPS_BYTECODE } from "../constants/contractData";


async function deploy(player1Choices: Player1Choices, signer: ethers.JsonRpcSigner | null) {
  const factory = new ethers.ContractFactory(RPS_ABI, RPS_BYTECODE, signer);

  const getC1Hash = (weapon: Weapon) => {
    const bytes256 = ethers.randomBytes(32);
    const salt = ethers.toBigInt(bytes256);

    return {
      c1Hash: ethers.solidityPackedKeccak256(['uint8', 'uint256'], [weapon, salt]),
      salt: salt
    }
  };

  const {c1Hash, salt} = getC1Hash(player1Choices.weapon);
  const stakeInWei = ethers.parseEther(player1Choices.stakeAmount);

  const j2 = player1Choices.player2Address;
  const contract = await factory.deploy(c1Hash, j2, {
    value: stakeInWei,
  });
  await contract.waitForDeployment();

  const contractAddress = await contract.getAddress();

  const gameSecret: StoredGameSecret = {
    // Storage only handles strings
    salt: String(salt),
    weapon: String(player1Choices.weapon)
  };

  localStorage.setItem(
    `rps_game_${contractAddress}`,
    JSON.stringify(gameSecret)
  );

  return contractAddress;
};

export default deploy;