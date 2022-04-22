import { registerFunction } from 'src/gameLogic/core/Factory/Register_Module/RegisterModule';
import { Character } from 'src/gameLogic/custom/Class/Character/Character';
import { ActionOutput, CalculatedStats, ResistanceStats } from "src/gameLogic/custom/Class/Character/Character.type";
import { StatusBattle as StatusBattleClass } from 'src/gameLogic/custom/Class/Status/StatusBattle';
import { tag } from "src/gameLogic/custom/customTypes/tags";

const register:registerFunction = ({status},{status:{StatusBattle}},Factory)=>{
  class StatusPetrified extends StatusBattle{
    private target!:Character;
    protected DURATION: number = 4;
    protected _resistanceStats: ResistanceStats = {poisonresistance:100};
    protected effect(target: Character): ActionOutput {
        const poison = this.getPoison(target);
        if(poison)poison.extraDuration = 1;
        return super.effect(target);
    }
    readonly type: "Petrified"="Petrified";
    get name(): string { return 'Petrified'; }
    onStatusGainded(target: Character): ActionOutput {
      this.target = target;
      return super.onStatusGainded(target);
    }
    // @ts-ignore
    protected get _stats_modifier():CalculatedStats{
      return {
        physicalDefence : this.target.calculatedStats.physicalDefence * (0.2),
        rangedDefence : this.target.calculatedStats.rangedDefence * (0.2),
        initiative : this.target.calculatedStats.initiative,
      };
    }
    onStatusRemoved(target: Character): ActionOutput { return super.onStatusRemoved(target); }
    private getPoison(target: Character):StatusBattleClass { return target.getStatus('Poison') as StatusBattleClass; }
    get tags(): tag[] { return super.tags.concat(['paralized','petrified'])}
    get description(): string { return "super.description"}
  }
  // tslint:disable-next-line: no-string-literal
  status["Petrified"]=StatusPetrified
}
const moduleName = "Petrified"
const moduleDependency:string[] = []
export { register, moduleName, moduleDependency}
