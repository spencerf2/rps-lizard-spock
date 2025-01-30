import { ChangeEvent, useState } from "react";
import rpsLogo from "./assets/Pierre_ciseaux_feuille_lézard_spock_aligned.svg";
import "./App.css";
import AwaitingPlayer2 from "./components/AwaitingPlayer2";
import CreateGame from "./components/CreateGame";
import LookupGame from "./components/LookupGame";
import Player2Move from "./components/Player2Move";
import Player1RevealResults from "./components/Player1RevealResults";
import ShowResults from "./components/ShowResults";
import AwaitingPlayer1RevealResults from "./components/AwaitingPlayer1RevealResults";

enum GameStatus {
  Initial = "INITIAL",
  AwaitingPlayer2Move = "AWAITING_PLAYER_2_MOVE",
  AwaitingPlayer1RevealResults = "AWAITING_PLAYER_1_REVEAL_RESULTS",
  Finished = "FINISHED",
}

function App() {
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.Initial);
  const [contractAddress, setContractAddress] = useState("");

  // TODO: Delete these 3 hardcoded values when hooking up smart contract:
  const [currentUserAddress, setCurrentUserAddress] = useState<string | null>(
    null,
  );
  const [player1Address, setPlayer1Address] = useState<string | null>(null);
  const [player2Address, setPlayer2Address] = useState<string | null>(null);

  const [player1Weapon, setPlayer1Weapon] = useState<string | null>(null);
  const [player2Weapon, setPlayer2Weapon] = useState<string | null>(null);
  const [stake, setStake] = useState<number | null>(null);
  const [winner, setWinner] = useState<string | null>(null);

  const connectMetaMask = () => {
    setCurrentUserAddress("0xPlayer2");
  };
  const getContractAddress = () => {
    return "0x524627FD8a27a78C1A3183726CfC0222AF40a7e2";
  };

  const handleLookupGameFormSubmit = (event: ChangeEvent<HTMLFormElement>) => {
    // TODO: Lookup game, setGameStatus, set player address info, pull in salt and player moves
    event.preventDefault();

    const address = event.target.contractAddress.value;
    setContractAddress(address);
    setCurrentUserAddress("0xPlayer2");
    setPlayer2Address("0xPlayer2");
    setGameStatus(GameStatus.AwaitingPlayer2Move);

    // ** Pull info from contract **

    if (currentUserAddress === player1Address) {
      // TODO: Render
    } else if (currentUserAddress === player2Address) {
      // TODO: Render
    } else {
      // Spectator
      // TODO: Render
    }
  };

  const player2MovesDeleteLater = () => {
    setPlayer2Weapon("Paper");
    setGameStatus(GameStatus.AwaitingPlayer1RevealResults);
    console.log("Waiting for Player 1 again");
  };

  // TODO: Do I need handlePlayer1WeaponSelect and handlePlayer1FormSubmit?
  // TODO: Check if there's a better way than having both handlePlayer1WeaponSelect and handlePlayer2WeaponSelect.
  const handlePlayer1WeaponSelect = (event: ChangeEvent<HTMLInputElement>) => {
    setPlayer1Weapon(event.target.value);
    console.log(
      `handlePlayer1WeaponSelect | event.target.value ${event.target.value}`,
    );
  };
  const handlePlayer2WeaponSelect = (event: ChangeEvent<HTMLInputElement>) => {
    setPlayer2Weapon(event.target.value);
    console.log(
      `handlePlayer2WeaponSelect | event.target.value ${event.target.value}`,
    );
  };
  const handlePlayer1FormSubmit = (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();

    setPlayer1Address(currentUserAddress);

    // TODO: Test the flow while pretending to be Player 1. Note that I need set a const for the contract addr they'll lookup
    setPlayer1Weapon(event.target.weapon.value);

    setStake(event.target.stake.value);
    setPlayer2Address(event.target.ethereumAddress.value);

    console.log("event.target.weapon", event.target.weapon);
    console.log("event.target.stake.value", event.target.stake.value);
    console.log(
      "event.target.ethereumAddress.value",
      event.target.ethereumAddress.value,
    );
    setContractAddress(getContractAddress());
    setGameStatus(GameStatus.AwaitingPlayer2Move);
    player2MovesDeleteLater();
  };
  const handlePlayer2FormSubmit = (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();

    setPlayer2Weapon(event.target.weapon.value);
    console.log("event.target.weapon", event.target.weapon);

    // TODO: Save Player2's move to the smart contract
    setGameStatus(GameStatus.AwaitingPlayer1RevealResults);
    
    // TODO: Delete this
    setWinner(currentUserAddress);
    setGameStatus(GameStatus.Finished);
  };

  const handlePlayer1RevealResultsSubmit = (
    event: ChangeEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    // TODO: Fix this
    setWinner(currentUserAddress);

    setGameStatus(GameStatus.Finished);
  };

  return (
    <>
      <div>
        <a
          href="https://en.wikipedia.org/wiki/Rock_paper_scissors#Additional_weapons"
          target="_blank"
        >
          <img
            src={rpsLogo}
            className="logo rock-paper-scissors-lizard-spock"
            alt="Rock, Paper, Scissors, Lizard, Spock logo"
          />
        </a>
      </div>
      <h1>Welcome to Rock, Paper, Scissors, Lizard, Spock</h1>
      {gameStatus === GameStatus.Initial && currentUserAddress === null && (
        <button onClick={connectMetaMask}>Click to Connect MetaMask</button>
      )}

      {gameStatus === GameStatus.Initial &&
        currentUserAddress !== null &&
        player1Address === null && (
          <>
            <LookupGame onContractAddressSearch={handleLookupGameFormSubmit} />
            <p className="divider">
              <b>OR</b>
            </p>
            <CreateGame
              weapon={player1Weapon}
              onWeaponSelect={handlePlayer1WeaponSelect}
              onFormSubmit={handlePlayer1FormSubmit}
            />
          </>
        )}
      {gameStatus === GameStatus.AwaitingPlayer2Move &&
        currentUserAddress === player1Address && (
          <AwaitingPlayer2 contractAddress={contractAddress} />
        )}
      {gameStatus === GameStatus.AwaitingPlayer2Move &&
        currentUserAddress === player2Address && (
          <Player2Move
            weapon={player2Weapon}
            onWeaponSelect={handlePlayer2WeaponSelect}
            onFormSubmit={handlePlayer2FormSubmit}
          />
        )}
      {gameStatus === GameStatus.AwaitingPlayer1RevealResults &&
        currentUserAddress === player1Address && (
          <Player1RevealResults
            onFormSubmit={handlePlayer1RevealResultsSubmit}
          />
        )}
      {gameStatus === GameStatus.AwaitingPlayer1RevealResults &&
        currentUserAddress === player2Address && (
          <AwaitingPlayer1RevealResults />
        )}
      {gameStatus === GameStatus.Finished && (
        <ShowResults
          currentUserAddress={currentUserAddress}
          player1Address={player1Address}
          player1Weapon={player1Weapon}
          player2Address={player2Address}
          player2Weapon={player2Weapon}
          winner={winner}
        />
      )}
    </>
  );
}

export default App;
