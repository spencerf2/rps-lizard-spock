interface IShowResultsProps {
  currentUserAddress: string | null;
  player1Address: string | null;
  player1Weapon: string | null;
  player2Address: string | null;
  player2Weapon: string | null;
  winner: string | null;
}
function ShowResults({
  currentUserAddress,
  player1Address,
  player1Weapon,
  player2Address,
  player2Weapon,
  winner,
}: IShowResultsProps) {
  const players = [player1Address, player2Address];
  return (
    <>
      <h2>
        Welcome Player{" "}
        {currentUserAddress === player1Address
          ? "1"
          : currentUserAddress === player2Address
            ? "2"
            : "Spectator"}
      </h2>
      <br />

      <br />
      <h3>
        {players.includes(currentUserAddress) ? "You" : winner}:{" "}
        {players.includes(currentUserAddress) && currentUserAddress === winner
          ? "Won"
          : players.includes(currentUserAddress) &&
              currentUserAddress !== winner
            ? "Lost"
            : "Tied"}
      </h3>
      <br />
      <br />
      <h4>
        {players.includes(currentUserAddress) ? "You" : "Player 1"} chose:{" "}
        {player1Weapon}
      </h4>
      <h4>
        {players.includes(currentUserAddress) ? "You" : "Player 2"} chose:{" "}
        {player2Weapon}
      </h4>
    </>
  );
}

export default ShowResults;
