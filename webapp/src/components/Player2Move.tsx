import { ChangeEventHandler } from "react";
import WeaponOptions from "./WeaponOptions";
import { Weapon } from "../constants/types";

interface IPlayer2MoveProps {
  weapon: Weapon;
  onWeaponSelect: ChangeEventHandler<HTMLInputElement>;
  onFormSubmit: ChangeEventHandler<HTMLFormElement>;
}
function Player2Move({
  weapon,
  onWeaponSelect,
  onFormSubmit,
}: IPlayer2MoveProps) {
  return (
    <>
      <h2>Welcome Player 2!</h2>
      <h3>You have X minutes and Y seconds to make your move</h3>
      <p>Choose Your Weapon...</p>
      <form onSubmit={onFormSubmit}>
        <WeaponOptions weapon={weapon} onWeaponSelect={onWeaponSelect} />
        <br />
        <button type="submit">Battle!</button>
      </form>
    </>
  );
}

export default Player2Move;
