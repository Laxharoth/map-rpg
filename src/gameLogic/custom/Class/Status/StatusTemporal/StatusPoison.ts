import { ActionOutput, Character } from 'src/gameLogic/custom/Class/Character/Character';
import { statusname } from "src/gameLogic/custom/Class/Status/Status.type";
import { StatusBattle } from "src/gameLogic/custom/Class/Status/StatusBattle";
import { tag } from "src/gameLogic/custom/customTypes/tags";
import { pushBattleActionOutput, randomCheck } from "src/gameLogic/custom/functions/htmlHelper.functions";

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
  { return super.canApply(target) && randomCheck(target.calculated_resistance.poisonresistance); }
  onStatusGainded(target: Character): ActionOutput
  { return pushBattleActionOutput(super.onStatusGainded(target),[[],[`${target.name} has been poisoned.`]]); }
  onStatusRemoved(target: Character): ActionOutput
  { return pushBattleActionOutput(super.onStatusRemoved(target),[[],[`${target.name} is no loger poisoned.`]]); }

  private calculatePoisonDamage(target: Character):number
  {
    const basedamage = target.energy_stats.hitpoints*1/8;
    const turnModifier = (5-this.DURATION)**2 / 100;
    const resistanceModifier = Math.max(0,100-target.calculated_resistance.poisonresistance)/100;
    const turndamage = basedamage*(1+turnModifier)*resistanceModifier;
    return Math.floor(turndamage)
  }

  get tags(): tag[] { return super.tags.concat(['poison'])}
}
