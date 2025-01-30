export enum Weapon {
  Null = 0,
  Rock = 1,
  Paper = 2,
  Scissors = 3,
  Lizard = 4,
  Spock = 5,
}
export const WeaponNumbers = [1, 2, 3, 4, 5]

export enum GameStatus {
  Initial = "INITIAL",
  AwaitingPlayer2Move = "AWAITING_PLAYER_2_MOVE",
  AwaitingPlayer1RevealResults = "AWAITING_PLAYER_1_REVEAL_RESULTS",
  Finished = "FINISHED",
}

export type Player1Choices = {
  weapon: Weapon;
  stakeAmount: string;
  player2Address: string;
};

export type GameResult = {
  player1Weapon: Weapon;
  player2Weapon: Weapon;
  player1Address: string;
  player2Address: string;
  winner: string | null;
  stake: number;
};

export type GameSecret = {
  salt: bigint;
  weapon: Weapon;
}

export type StoredGameSecret = {
  salt: string;
  weapon: string;
}