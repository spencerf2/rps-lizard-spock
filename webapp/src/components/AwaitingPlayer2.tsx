import { useState } from "react";
import "./AwaitingPlayer2.css";

interface IAwaitingPlayer2Props {
  contractAddress: string;
  currentUserAddress: string;
  player1Address: string;
}
function AwaitingPlayer2({
  contractAddress,
  currentUserAddress,
  player1Address,
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
      console.log(error);
    }
  };

  return (
    <div>
      <h2>Player 2 has X minutes and Y seconds to move!</h2>
      {currentUserAddress === player1Address && (
        <>
          <h3>Send Player 2 the contract address below:</h3>
          <h4>{copyText}</h4>
          <h4 id="contract-address" onClick={handleCopy}>
            {contractAddress}
          </h4>
        </>
      )}
    </div>
  );
}

export default AwaitingPlayer2;
