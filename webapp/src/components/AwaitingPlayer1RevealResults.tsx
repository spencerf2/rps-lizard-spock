import { ChangeEventHandler } from "react";

interface IAwaitingPlayer1RevealResultsProps {
  currentUserAddress: string;
  player2Address: string;
  onTimeoutClaim: ChangeEventHandler<HTMLFormElement>;
}
function AwaitingPlayer1RevealResults({
  currentUserAddress,
  player2Address,
  onTimeoutClaim,
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
      <br />
      {currentViewer === "Player 2" && (
        <>
          <h4>
            If it's been more than 5 minutes, and Player 1 has not revealed the
            results...
          </h4>
          <form onSubmit={onTimeoutClaim}>
            <button type="submit">Claim Winnings via Timeout!</button>
          </form>
        </>
      )}
    </div>
  );
}

export default AwaitingPlayer1RevealResults;
