import { Int } from './../../gameLogic/custom/ClassHelper/Int';
import { register_function } from "src/gameLogic/core/Factory/Register_Module/RegisterModule";
import { Character } from "src/gameLogic/custom/Class/Character/Character";
import { ActionOutput, CalculatedStats, FullCoreStats } from "src/gameLogic/custom/Class/Character/Character.type";
import { statustype } from "src/gameLogic/custom/Class/Status/Status.type";
import { tag } from "src/gameLogic/custom/customTypes/tags";

const register:register_function = ({status}, {status:{StatusBattle}}, Factory)=>{
  class Blind extends StatusBattle{
    protected DURATION: number = 3;
    type: statustype = "Blind";
    get name(): string {
      return "Blind";
    }
    get description(): string {
      return "reduces accurancy and evasion"
    }
    // @ts-ignore
    protected get _stats_modifier(): CalculatedStats {
      return {
        accuracy:-15,
        evasion:-15,
      }
    };
    get tags(): tag[]{return ["Blind"]}
  }
  class Advantage extends StatusBattle{
    protected DURATION: number = 1;
    type: statustype = "Advantage";
    get name(): string {
      return "Advantage";
    }
    get description(): string {
      return "";
    }
    // @ts-ignore
    protected get _stats_modifier(): CalculatedStats{
      return { accuracy:20 };
    };
    get tags(): tag[]{return ["Advantage"]}
  }
  class Hide extends StatusBattle{
    protected DURATION: number = 1;
    type: statustype = "Hide";
    get name(): string {
      return "Hide";
    }
    get description(): string {
      return "Increase evasion gain advantage at start of turn";
    }
    // @ts-ignore
    protected get _stats_modifier(): CalculatedStats{
      return {evasion:20}
    }
    onStatusRemoved(target: Character): ActionOutput {
      target.addStatus(new Hide(this.masterService));
      return super.onStatusRemoved(target);
    }
    get tags(): tag[]{return ["Hide"]}
  }
  class Restrained extends StatusBattle{
    protected DURATION: number = Infinity;
    type: statustype = "Restrained";
    get name(): string {
      return "Restrained";
    }
    get description(): string {
      return "";
    }
    protected effect(target: Character): ActionOutput {
      if(Factory.randomCheck(target.calculated_stats.evasion))
        this.DURATION = 0;
      else{
        target.calculated_stats.initiative = 0 as Int;
        target.calculated_stats.evasion = 0 as Int;
      }
      return super.effect(target);
    }
    get tags(): tag[]{return ["Restrained"]}
  }
  class Guidance extends StatusBattle{
    static readonly emptyStat  :FullCoreStats = { aim:0 as Int,intelligence:0 as Int,speed:0 as Int,strenght:0 as Int,stamina:0 as Int }
    static readonly aimOnlyStat:FullCoreStats = { aim:1000 as Int,intelligence:0 as Int,speed:0 as Int,strenght:0 as Int,stamina:0 as Int }
    protected DURATION: number = 2;
    type: statustype = "Guidance";
    get name(): string { return "Guidance"; }
    get description(): string { return "Increase the aim of the character"; }

    onStatusGainded(target: Character): ActionOutput {
      const emptyCalculatedStats = target.battle_class.calculate_stats(Guidance.emptyStat) as unknown as unknown as { [key:string]: Int};
      const aimCalculatedStats = target.battle_class.calculate_stats(Guidance.aimOnlyStat) as unknown as unknown as { [key:string]: Int};
      const modifiers = this.statsModifier as unknown as unknown as { [key:string]: Int};
      for( const statname of Object.keys(emptyCalculatedStats)){
        if(aimCalculatedStats[statname] - emptyCalculatedStats[statname] > 0){
          modifiers[statname] = 10 as Int;
        }
      }
      return super.onStatusGainded(target);
    }
  }
  status["Blind"] = Blind;
  status["Advantage"] = Advantage;
  status["Hide"] = Hide;
  status["Restrained"] = Restrained;
  status["Guidance"] = Guidance;
}
const module_name = "small-campaign-status";
const module_dependency:string[] = [];
export { register, module_name, module_dependency };
