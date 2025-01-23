import { ChangeEventHandler } from "react";

interface ILookupGameProps {
  onContractAddressSearch: ChangeEventHandler<HTMLFormElement>;
}
function LookupGame({ onContractAddressSearch }: ILookupGameProps) {
  return (
    <div>
      <h2>Resuming a game? Enter contract address:</h2>
      <form onSubmit={onContractAddressSearch}>
        <input type="text" name="contractAddress" placeholder="Enter Contract Address"></input>
        <button>Search!</button>
      </form>
    </div>
  );
}

export default LookupGame;
