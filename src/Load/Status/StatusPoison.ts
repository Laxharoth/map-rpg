import { registerFunction } from 'src/gameLogic/core/Factory/Register_Module/RegisterModule';
import { Character } from 'src/gameLogic/custom/Class/Character/Character';
import { ActionOutput } from "src/gameLogic/custom/Class/Character/Character.type";
import { tag } from "src/gameLogic/custom/customTypes/tags";
const register:registerFunction = ({status},{status:statusConstructor},Factory)=>{
  const { StatusBattle } = statusConstructor
  class StatusPoison extends StatusBattle
  {
    protected DURATION: number = 6;
    readonly type: "Poison"="Poison"
    get name(): string { return 'Poison'; }
    get description(): string { return `Causes the target to lose hp gradually\n${this.DURATION} turns left.`; }
    protected effect(target: Character): ActionOutput{
      const damage = this.calculatePoisonDamage(target);
      target.takeDamage(damage);
      return [[],[`Poison causes ${damage} points of damage to ${target.name}`]];
    }
    canApply(target:Character): boolean
    { return super.canApply(target) && Factory.randomCheck(100-target.calculatedResistance.poisonresistance); }
    onStatusGainded(target: Character): ActionOutput
    { return Factory.pushBattleActionOutput(super.onStatusGainded(target),[[],[`${target.name} has been poisoned.`]]); }
    onStatusRemoved(target: Character): ActionOutput
    { return Factory
        .pushBattleActionOutput(super.onStatusRemoved(target),[[],[`${target.name} is no loger poisoned.`]]); }

    private calculatePoisonDamage(target: Character):number
    {
      const basedamage = target.calculatedStats.hitpoints*1/8;
      const turnModifier = (5-this.DURATION)**2 / 100;
      const resistanceModifier = Math.max(0,100-target.calculatedResistance.poisonresistance)/100;
      const turndamage = basedamage*(1+turnModifier)*resistanceModifier;
      return Math.floor(turndamage)
    }
    get tags(): tag[] { return super.tags.concat(['poison'])}
  }
  // tslint:disable: no-string-literal
  status["Poison"]=StatusPoison
  // @ts-ignore
  statusConstructor["Poison"]=StatusPoison
}
const moduleName = "Poison";
const moduleDependency:string[] = [];
export { register, moduleName, moduleDependency}
