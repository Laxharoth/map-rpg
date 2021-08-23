import { battleActionOutput } from "src/app/customTypes/customTypes";
import { Character } from "../../Character";
import { StatusFight } from "../StatusFight";

export class StatusRangedAttack extends StatusFight
{
  protected DURATION: number = 1;
  get name(): string {
    return 'Ranged Attack';
  }
  get description(): string {
    return 'Using a ranged attack puts space between you and the enemy.\nIncreased evasion by 10%.';
  }
  protected effect(target: Character): battleActionOutput {
    target.roundStats.evasion+= 5 + 3/5 * target.originalstats.speed;
    target.roundStats.evasion*=1.10;
    return [[],[`${target.name} takes some space to shoot the enemy`]];
  }
  onStatusGainded(target: Character)
  { return this.applyEffect(target) }
}
