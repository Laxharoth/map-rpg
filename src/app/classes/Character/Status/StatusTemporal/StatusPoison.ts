import { battleActionOutput } from "src/app/customTypes/customTypes";
import { Character } from "../../Character";
import { StatusFight } from "../StatusFight";

export class StatusPoison extends StatusFight
{
  protected DURATION: number;
  get name(): string { return 'Poison'; }
  get description(): string { return `Causes the target to lose hp gradually\n${this.DURATION} turns left.`; }
  protected effect(target: Character): battleActionOutput
  {
    const damage = Math.floor(target.stats.hitpoints*7/8);
    target.stats.hitpoints-=damage;
    return [[],[`Poison causes ${damage} points of damage to ${target.name}`]];
  }
  canApply(target:Character): boolean
  { return super.canApply(target) && target.roundStats.poisonresistance<Math.random()*100; }
  onStatusGainded(target: Character): battleActionOutput
  { return [[],[`${target.name} has been poisoned.`]]; }
  onEffectEnded(target: Character): battleActionOutput
  { return [[],[`${target.name} is no loger poisoned.`]]; }
}
