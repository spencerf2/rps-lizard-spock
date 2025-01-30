interface IAwaitingPlayer1RevealResultsProps {
  currentUserAddress: string;
  player2Address: string;
}
function AwaitingPlayer1RevealResults({
  currentUserAddress,
  player2Address,
}: IAwaitingPlayer1RevealResultsProps) {
  const currentViewer =
    currentUserAddress === player2Address ? "Player 2" : "Spectator";
  return (
    <div>
      <h2>Welcome {currentViewer}!</h2>

      <h3>
        Player 1 has 4 min 27 seconds to reveal the results or{" "}
        {currentViewer === "Player 2" ? "you win" : "Player 2 wins"} by
        forfeit...
      </h3>
    </div>
  );
}

export default AwaitingPlayer1RevealResults;
