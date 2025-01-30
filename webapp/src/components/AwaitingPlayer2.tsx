import { ChangeEventHandler, useState } from "react";
import "./AwaitingPlayer2.css";

interface IAwaitingPlayer2Props {
  contractAddress: string;
  currentUserAddress: string;
  player1Address: string;
  onTimeoutClaim: ChangeEventHandler<HTMLFormElement>;
}
function AwaitingPlayer2({
  contractAddress,
  currentUserAddress,
  player1Address,
  onTimeoutClaim,
}: IAwaitingPlayer2Props) {
  const [copyText, setCopyText] = useState("Click to copy");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(contractAddress);
      setCopyText("Copied!");
    } catch (error) {
      setCopyText(
        "Hmm. Didn't work, try clicking again or manually copy via highlighting it",
      );
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Player 2 has X minutes and Y seconds to move!</h2>
      {currentUserAddress === player1Address && (
        <>
          <h3>Two important notes:</h3>
          <h3>
            1. Do not clear your browser cache until you've clicked the "Reveal
            Results!" button
            <br />
            or your stake, and Player 2's, stake will remain locked within the
            game.
          </h3>
          <h3>2. Send Player 2 the contract address below so they can play:</h3>
          <h4>{copyText}</h4>
          <h4 id="contract-address" onClick={handleCopy}>
            {contractAddress}
          </h4>
          <br />
          <h4>If it's been more than 5 minutes and Player 2 hasn't moved...</h4>
          <form onSubmit={onTimeoutClaim}>
            <button type="submit">Claim Winnings via Timeout!</button>
          </form>
        </>
      )}
    </div>
  );
}

export default AwaitingPlayer2;
