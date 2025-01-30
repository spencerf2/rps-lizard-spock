import { ethers } from "ethers";
import { ChangeEvent, useState } from "react";
import "./App.css";
import AwaitingPlayer2 from "./components/AwaitingPlayer2";
import CreateGame from "./components/CreateGame";
import LookupGame from "./components/LookupGame";
import Player2Move from "./components/Player2Move";
import Player1RevealResults from "./components/Player1RevealResults";
import ShowResults from "./components/ShowResults";
import AwaitingPlayer1RevealResults from "./components/AwaitingPlayer1RevealResults";
import deploy from "./services/contractDeployment";
import {
  Player1Choices,
  GameStatus,
  Weapon,
  GameSecret,
  GameResult,
} from "./constants/types";
import { RPS_ABI } from "./constants/contractData";
import getPlayer1WeaponFromLocalChain from "./services/getPlayer1WeaponFromLocalChain";

function App() {
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.Initial);
  const [contractAddress, setContractAddress] = useState("");

  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [provider, setProvider] = useState<
    ethers.BrowserProvider | ethers.AbstractProvider | null
  >(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [currentUserAddress, setCurrentUserAddress] = useState<string | null>(
    null,
  );
  const [player1Address, setPlayer1Address] = useState<string | null>(null);
  const [player2Address, setPlayer2Address] = useState<string | null>(null);

  const [player1Weapon, setPlayer1Weapon] = useState<Weapon>(Weapon.Null);
  const [player2Weapon, setPlayer2Weapon] = useState<Weapon>(Weapon.Null);
  const [stake, setStake] = useState<number | null>(null);
  const [winner, setWinner] = useState<string | null>(null);

  const connectMetaMask = async () => {
    if (isConnecting) return;

    try {
      setIsConnecting(true);
      let _signer = null;

      let _provider;
      if (window.ethereum == null) {
        // If MetaMask is not installed, we use the default provider,
        // which is backed by a variety of third-party services (such
        // as INFURA). They do not have private keys installed,
        // so they only have read-only access
        console.log("MetaMask not installed; using read-only defaults");
        _provider = ethers.getDefaultProvider();
      } else {
        // Connect to the MetaMask EIP-1193 object. This is a standard
        // protocol that allows Ethers access to make all read-only
        // requests through MetaMask.
        _provider = new ethers.BrowserProvider(window.ethereum);

        // It also provides an opportunity to request access to write
        // operations, which will be performed by the private key
        // that MetaMask manages for the user.
        _signer = await _provider.getSigner();
      }
      setSigner(_signer);
      if (_signer) {
        setCurrentUserAddress(_signer.address);
      }
      setProvider(_provider);
    } catch (error) {
      console.error(`There was an error connecting: ${error}`);
    } finally {
      setIsConnecting(false);
    }
  };

  const getGameSecret = (contractAddress: string): GameSecret | null => {
    // ** Retrieve gameSecret from local storage and 'unstringify' its values **
    const storedGameSecret = localStorage.getItem(
      `rps_game_${contractAddress}`,
    );
    if (!storedGameSecret) return null;

    const gameSecret = JSON.parse(storedGameSecret);
    const originalGameSecret: GameSecret = {
      salt: BigInt(gameSecret.salt),
      weapon: Number(gameSecret.weapon) as Weapon,
    };
    return originalGameSecret;
  };

  const updateGameStatusAndStates = async (
    address: string,
    rpsContract: ethers.Contract,
    stakeAmount: number,
    addressPlayer1: string,
    addressPlayer2: string,
    player2Move: Weapon,
    player2TimedOut?: boolean,
  ): Promise<void> => {
    if (currentUserAddress === addressPlayer1) {
      // TODO: Connect to signer here
    } else if (currentUserAddress === addressPlayer2) {
      // TODO: Connect to signer here
    }

    if (Number(stakeAmount) === 0) {
      // Game is finished. Get all data before updating state

      if (player2TimedOut !== undefined) {
        // Timeout claimed by a player
        let player1Weapon = Weapon.Null;

        if (player2TimedOut) {
          // Player 1 must have called the timeout so we can get their weapon
          // from local storage
          const gameSecret = getGameSecret(address);
          if (gameSecret) {
            player1Weapon = gameSecret.weapon;
          }
        }
        const gameResult: GameResult = {
          player1Weapon,
          player2Weapon: player2TimedOut ? Weapon.Null : player2Move,
          player1Address: addressPlayer1,
          player2Address: addressPlayer2,
          winner: player2TimedOut ? addressPlayer1 : addressPlayer2,
          stake: stakeAmount,
        };

        setPlayer1Weapon(gameResult.player1Weapon);
        setPlayer2Weapon(gameResult.player2Weapon);
        setPlayer1Address(gameResult.player1Address);
        setPlayer2Address(gameResult.player2Address);
        setWinner(gameResult.winner);
        setStake(gameResult.stake);
        setGameStatus(GameStatus.Finished);
      } else {
        // Game is over but no one specifically pushed a "Claim Winnings via Timeout!" button

        // TODO: Check for env and use getPlayer1WeaponFromEtherscan if production
        const weapon = await getPlayer1WeaponFromLocalChain(provider, address);

        const player1Wins = await rpsContract.win(weapon, player2Move);

        const gameResult: GameResult = {
          player1Weapon: weapon,
          player2Weapon: player2Move,
          player1Address: addressPlayer1,
          player2Address: addressPlayer2,
          winner:
            Number(weapon) === Number(player2Move)
              ? null // Mirror contract logic checking for a tie first
              : player1Wins
                ? addressPlayer1
                : addressPlayer2,
          stake: stakeAmount,
        };

        // Update all state before changing game status
        // Ensures ShowResults has complete data when it renders
        setPlayer1Weapon(gameResult.player1Weapon);
        setPlayer2Weapon(gameResult.player2Weapon);
        setPlayer1Address(gameResult.player1Address);
        setPlayer2Address(gameResult.player2Address);
        setWinner(gameResult.winner);
        setStake(gameResult.stake);
        setGameStatus(GameStatus.Finished);
      }
    } else if (player2Move) {
      // Game in progress
      setStake(stakeAmount);
      setPlayer1Address(addressPlayer1);
      setPlayer2Address(addressPlayer2);
      setPlayer2Weapon(player2Move);
      setGameStatus(GameStatus.AwaitingPlayer1RevealResults);
    } else {
      // Game just started
      setStake(stakeAmount);
      setPlayer1Address(addressPlayer1);
      setPlayer2Address(addressPlayer2);
      setGameStatus(GameStatus.AwaitingPlayer2Move);
    }
  };
  const handleLookupGameFormSubmit = async (
    event: ChangeEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    console.log("Lookup game button pushed");

    // Load contract using address user provided
    const address = event.target.contractAddress.value;
    if (!address) {
      alert(
        `Please provide a valid MetaMask Ethereum Address.\n\nInvalid Address: ${address}`,
      );
    }

    // TODO: Change this to provider for added security--so it's read only
    const rps = new ethers.Contract(address, RPS_ABI, signer);
    try {
      await rps.j1();
    } catch (error) {
      alert("Invalid contract address. Game not found!");
      console.error(error);
      return;
    }

    setContractAddress(address);
    setContract(rps);

    // Set states using data from contract
    try {
      const j1 = await rps.j1();
      const j2 = await rps.j2();
      const stakeAmount = await rps.stake();
      const c2 = await rps.c2();

      await updateGameStatusAndStates(address, rps, stakeAmount, j1, j2, c2);
    } catch (error) {
      console.error("Error getting game data:", error);
      alert("Error loading game data. Please try again.");
    }
  };

  const handlePlayer1WeaponSelect = (event: ChangeEvent<HTMLInputElement>) => {
    setPlayer1Weapon(Number(event.target.value) as Weapon);
  };
  const handlePlayer2WeaponSelect = (event: ChangeEvent<HTMLInputElement>) => {
    setPlayer2Weapon(Number(event.target.value) as Weapon);
  };
  const handlePlayer1FormSubmit = async (
    event: ChangeEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const weapon = Number(event.target.weapon.value) as Weapon;
    setPlayer1Address(currentUserAddress);
    setPlayer1Weapon(weapon);

    setStake(event.target.stake.value);
    setPlayer2Address(event.target.ethereumAddress.value);

    const player1Choices: Player1Choices = {
      weapon: weapon,
      stakeAmount: event.target.stake.value,
      player2Address: event.target.ethereumAddress.value,
    };
    const deployedContractAddress = await deploy(player1Choices, signer);
    setContractAddress(deployedContractAddress);
    setGameStatus(GameStatus.AwaitingPlayer2Move);
  };
  const handlePlayer2FormSubmit = async (
    event: ChangeEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const weapon = event.target.weapon.value;
    setPlayer2Weapon(weapon);

    // ** Save Player2's move to the smart contract **

    if (contract && signer) {
      try {
        await contract.play(weapon, { value: stake });
        console.log("Successfully set weapon on RPS smart contract");
      } catch (error) {
        console.log(
          "There was an error while player 2 was submitting their move | error:",
          error,
        );
      }
    } else {
      throw Error(
        `Could not access RPS smart contract ${contract} or signer ${signer}`,
      );
    }

    setGameStatus(GameStatus.AwaitingPlayer1RevealResults);
  };

  const handlePlayer1RevealResultsSubmit = async (
    event: ChangeEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!contract) {
      console.error("Contract not found during reveal");
      return;
    }

    const gameSecret = getGameSecret(contractAddress);
    if (!gameSecret) {
      console.error("Game secret not found. You may lose your stake");
      return;
    }
    const { salt, weapon } = gameSecret;

    try {
      console.log("Starting to solve");
      const tx = await contract.solve(weapon, salt);
      console.log("Waiting for transaction to be mined");
      await tx.wait();
      console.log("Finished solving");
      const finalStake = await contract.stake();
      if (Number(finalStake) === 0) {
        const player1Wins = await contract.win(weapon, player2Weapon);

        const gameResult: GameResult = {
          player1Weapon: weapon,
          player2Weapon: player2Weapon,
          player1Address: player1Address!,
          player2Address: player2Address!,
          winner:
            Number(weapon) === Number(player2Weapon)
              ? null // Mirror contract logic checking for a tie first
              : player1Wins
                ? player1Address
                : player2Address,
          stake: Number(finalStake),
        };

        setPlayer1Weapon(gameResult.player1Weapon);
        setPlayer2Weapon(gameResult.player2Weapon);
        setWinner(gameResult.winner);
        setStake(gameResult.stake);
        setGameStatus(GameStatus.Finished);

        localStorage.removeItem(`rps_game_${contractAddress}`);
      }
    } catch (error) {
      console.error("Error revealing the winner", error);
    }
  };

  const handleTimeoutClaim = async (
    event: ChangeEvent<HTMLFormElement>,
    player2TimedOut: boolean = true, // Assume the most common case: Player 2 didn't move and Player 1 is calling them on it
  ) => {
    event.preventDefault();

    if (!contract) {
      console.error("Contract not found during timeout claim");
      return;
    }

    try {
      console.log(
        `Starting timeout claim ${player2TimedOut ? "Player 2 timed out" : "Player 1 timed out"}`,
      );
      const tx = await contract[player2TimedOut ? "j2Timeout" : "j1Timeout"]();
      console.log("Waiting for transaction to be mined");
      await tx.wait();
      console.log("Done claiming timeout");

      const stakeAmount = await contract.stake();

      await updateGameStatusAndStates(
        contractAddress,
        contract,
        stakeAmount,
        player1Address!,
        player2Address!,
        player2Weapon,
        player2TimedOut,
      );
    } catch (error) {
      console.error("Error claiming timeout:", error);
    }
  };

  return (
    <>
      <div>
        <a
          href="https://en.wikipedia.org/wiki/Rock_paper_scissors#Additional_weapons"
          target="_blank"
        >
          <img
            src="Pierre_ciseaux_feuille_lézard_spock_aligned.svg"
            className="logo rock-paper-scissors-lizard-spock"
            alt="Rock, Paper, Scissors, Lizard, Spock logo"
          />
        </a>
      </div>
      <h1>Welcome to Rock, Paper, Scissors, Lizard, Spock</h1>
      {gameStatus === GameStatus.Initial && currentUserAddress === null && (
        <button onClick={connectMetaMask} disabled={isConnecting}>
          {isConnecting
            ? "Connecting to MetaMask..."
            : "Click to Connect MetaMask"}
        </button>
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
      currentUserAddress === player2Address ? (
        <Player2Move
          weapon={player2Weapon}
          onWeaponSelect={handlePlayer2WeaponSelect}
          onFormSubmit={handlePlayer2FormSubmit}
        />
      ) : (
        gameStatus === GameStatus.AwaitingPlayer2Move &&
        currentUserAddress &&
        player1Address && (
          <AwaitingPlayer2
            contractAddress={contractAddress}
            currentUserAddress={currentUserAddress}
            player1Address={player1Address}
            onTimeoutClaim={handleTimeoutClaim}
          />
        )
      )}
      {gameStatus === GameStatus.AwaitingPlayer1RevealResults &&
      currentUserAddress === player1Address ? (
        <Player1RevealResults onFormSubmit={handlePlayer1RevealResultsSubmit} />
      ) : (
        gameStatus === GameStatus.AwaitingPlayer1RevealResults &&
        currentUserAddress &&
        player2Address && (
          <AwaitingPlayer1RevealResults
            currentUserAddress={currentUserAddress}
            player2Address={player2Address}
            onTimeoutClaim={(event) => handleTimeoutClaim(event, false)}
          />
        )
      )}
      {gameStatus === GameStatus.Finished &&
        currentUserAddress &&
        player1Address &&
        player2Address && (
          <ShowResults
            gameAddress={contractAddress}
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
