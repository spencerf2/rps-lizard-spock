import { ChangeEventHandler } from "react";

interface IPlayer1RevealResults {
  onFormSubmit: ChangeEventHandler<HTMLFormElement>;
}
function Player1RevealResults({ onFormSubmit }: IPlayer1RevealResults) {
  return (
    <>
      <h2>Welcome Player 1!</h2>
      <h3>Player 2 already chose their weapon</h3>
      <h3>
        You have X minutes and Y seconds to reveal the results or you forfeit
        your stake!
      </h3>
      <form onSubmit={onFormSubmit}>
        <button type="submit">Reveal Results!</button>
      </form>
    </>
  );
}

export default Player1RevealResults;
