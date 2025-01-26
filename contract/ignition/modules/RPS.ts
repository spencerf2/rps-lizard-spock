// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const C1_HASH: string = '0x8c5b1bc7289a13fe02d627cb87a1a087427e1e9bb536e61fbd2de7bbdff20fc3';
const PLAYER_2_ADDRESS: string = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8';

const RPSModule = buildModule("RPSModule", (m) => {
  const c1Hash = m.getParameter("c1Hash", C1_HASH);
  const player2Address = m.getParameter("player2Address", PLAYER_2_ADDRESS);

  const rps = m.contract("RPS", [c1Hash, player2Address], {
    value: 1000000000000000n,
  });

  return { rps };
});

export default RPSModule;
