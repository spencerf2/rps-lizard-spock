import { ChangeEventHandler } from "react";
import "./WeaponOptions.css";
import { Weapon, WeaponNumbers } from "../constants/types";

interface IWeaponOptionsProps {
  weapon: Weapon;
  onWeaponSelect: ChangeEventHandler<HTMLInputElement>;
}
function WeaponOptions({ weapon, onWeaponSelect }: IWeaponOptionsProps) {
  return (
    <div className="weapon">
      <div className="weapon-options">
        {WeaponNumbers.map((num) => (
          <div key={num}>
            <input
              type="radio"
              id={Weapon[num].toLowerCase()}
              name="weapon"
              value={num}
              checked={Number(weapon) === num}
              onChange={onWeaponSelect}
            />
            <label htmlFor={Weapon[num].toLowerCase()}>{Weapon[num]}</label>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WeaponOptions;
