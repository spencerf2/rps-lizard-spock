import { Weapon } from "../constants/types";

interface IShowResultsProps {
  gameAddress: string;
  currentUserAddress: string;
  player1Address: string;
  player1Weapon: Weapon;
  player2Address: string;
  player2Weapon: Weapon;
  winner: string | null;
}
function ShowResults({
  gameAddress,
  currentUserAddress,
  player1Address,
  player1Weapon,
  player2Address,
  player2Weapon,
  winner,
}: IShowResultsProps) {
  const currentViewer =
    currentUserAddress === player1Address
      ? "Player 1"
      : currentUserAddress === player2Address
        ? "Player 2"
        : "Spectator";

  const getResultMessage = () => {
    let result: string;

    if (currentViewer === "Spectator") {
      result = winner
        ? `${winner === player1Address ? "Player 1" : "Player 2"} Won!`
        : "Game Tied!";
    } else if (winner === null) {
      result = "Game Tied!";
    } else {
      result = winner === currentUserAddress ? "You Won!" : "You Lost...";
    }

    return result;
  };

  const getWeaponText = (weaponNumber: Weapon) => {
    return Weapon[weaponNumber] || "Unknown"; // Convert enum number to string
  };

  return (
    <>
      <h2>Welcome {currentViewer}!</h2>
      <h3>
        Results are in for game
        <br />
        <small>{gameAddress}</small>
        <br />
        <br />
        And...
      </h3>
      <br />
      <h3>{getResultMessage()}</h3>
      <br />
      <h4>
        {currentViewer === "Spectator"
          ? "Player 1"
          : currentUserAddress === player1Address
            ? "You"
            : "Player 1"}{" "}
        chose: {getWeaponText(player1Weapon)}
      </h4>
      <h4>
        {currentViewer === "Spectator"
          ? "Player 2"
          : currentUserAddress === player2Address
            ? "You"
            : "Player 2"}{" "}
        chose: {getWeaponText(player2Weapon)}
      </h4>
    </>
  );
}

export default ShowResults;
