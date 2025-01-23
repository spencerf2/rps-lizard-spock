import { ChangeEventHandler } from "react";
import "./WeaponOptions.css";

interface IWeaponOptionsProps {
  weapon: string | null;
  onWeaponSelect: ChangeEventHandler<HTMLInputElement>;
}
function WeaponOptions({ weapon, onWeaponSelect }: IWeaponOptionsProps) {
  return (
    <div className="weapon">
      <div className="weapon-options">
        <div>
          <input
            type="radio"
            id="rock"
            name="weapon"
            value="Rock"
            checked={weapon === "Rock"}
            onChange={onWeaponSelect}
          />
          <label htmlFor="rock">Rock</label>
        </div>
        <div>
          <input
            type="radio"
            id="paper"
            name="weapon"
            value="Paper"
            checked={weapon === "Paper"}
            onChange={onWeaponSelect}
          />
          <label htmlFor="paper">Paper</label>
        </div>
        <div>
          <input
            type="radio"
            id="scissors"
            name="weapon"
            value="Scissors"
            checked={weapon === "Scissors"}
            onChange={onWeaponSelect}
          />
          <label htmlFor="scissors">Scissors</label>
        </div>
        <div>
          <input
            type="radio"
            id="lizard"
            name="weapon"
            value="Lizard"
            checked={weapon === "Lizard"}
            onChange={onWeaponSelect}
          />
          <label htmlFor="lizard">Lizard</label>
        </div>
        <div>
          <input
            type="radio"
            id="spock"
            name="weapon"
            value="Spock"
            checked={weapon === "Spock"}
            onChange={onWeaponSelect}
          />
          <label htmlFor="spock">Spock</label>
        </div>
      </div>
    </div>
  );
}

export default WeaponOptions;
