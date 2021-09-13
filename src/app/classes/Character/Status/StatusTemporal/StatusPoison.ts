import { ActionOutput } from "src/app/customTypes/customTypes";
import { statusname } from "src/app/customTypes/statusnames";
import { tag } from "src/app/customTypes/tags";
import { pushBattleActionOutput, randomCheck } from "src/app/htmlHelper/htmlHelper.functions";
import { Character } from "../../Character";
import { StatusBattle } from "../StatusBattle";

export class StatusPoison extends StatusBattle
{
  protected DURATION: number = 6;
  get name(): statusname { return 'Poison'; }
  get description(): string { return `Causes the target to lose hp gradually\n${this.DURATION} turns left.`; }
  protected effect(target: Character): ActionOutput
  {
    const damage = this.calculatePoisonDamage(target);
    target.takeDamage(damage);
    return [[],[`Poison causes ${damage} points of damage to ${target.name}`]];
  }
  canApply(target:Character): boolean
  { return super.canApply(target) && randomCheck(target.roundStats.poisonresistance); }
  onStatusGainded(target: Character): ActionOutput
  { return pushBattleActionOutput(super.onStatusGainded(target),[[],[`${target.name} has been poisoned.`]]); }
  onStatusRemoved(target: Character): ActionOutput
  { return pushBattleActionOutput(super.onStatusRemoved(target),[[],[`${target.name} is no loger poisoned.`]]); }

  private calculatePoisonDamage(target: Character):number
  {
    const basedamage = target.stats.hitpoints*1/8;
    const turnModifier = (5-this.DURATION)**2 / 100;
    const resistanceModifier = Math.max(0,100-target.stats.poisonresistance)/100;
    const turndamage = basedamage*(1+turnModifier)*resistanceModifier;
    return Math.floor(turndamage)
  }

  get tags(): tag[] { return super.tags.concat(['poison'])}
}
