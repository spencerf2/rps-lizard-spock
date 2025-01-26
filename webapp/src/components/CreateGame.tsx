import { ChangeEventHandler } from "react";
import WeaponOptions from "./WeaponOptions";
import "./CreateGame.css";
import { Weapon } from "../constants/types";

interface ICreateGameProps {
  weapon: Weapon;
  onWeaponSelect: ChangeEventHandler<HTMLInputElement>;
  onFormSubmit: ChangeEventHandler<HTMLFormElement>;
}
function CreateGame({
  weapon,
  onWeaponSelect,
  onFormSubmit,
}: ICreateGameProps) {
  return (
    <>
      <h2>Create a new game as Player 1!</h2>
      <p>Choose Your Weapon...</p>
      <form onSubmit={onFormSubmit}>
        <WeaponOptions weapon={weapon} onWeaponSelect={onWeaponSelect} />
        <p>How much are you betting?!</p>
        <input type="text" name="stake" placeholder="Enter Stake Amount" />
        <br />
        <p>Who are you playing with?</p>
        <input
          type="text"
          name="ethereumAddress"
          id="ethereumAddress"
          placeholder="Enter Player 2's MetaMask Ethereum Sepolia Address"
        />
        <br />
        <br />
        <button type="submit">Let the Game Begin!</button>
      </form>
    </>
  );
}

export default CreateGame;
