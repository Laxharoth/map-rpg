import { Description, nextOption } from "src/app/classes/Descriptions/Description";
import { battleActionOutput } from "src/app/customTypes/customTypes";
import { Character } from "../../Character";
import { StatusFight } from "../StatusFight";

export class StatusParalisis extends StatusFight {
  protected DURATION: number = 0;
  get name(): string {
    return 'Paralisis';
  }
  get description(): string {
    return "The target can't move due to an energy shock.";
  }
  protected effect(target: Character): battleActionOutput
  { return [[],[`${target.name} can't move`]] }
  onStatusGainded(target: Character): battleActionOutput
  {
    switch(Math.floor(Math.random() * 7))
    {
      case 1:case 2:case 3: case 4:this.DURATION =1;break;
      case 5: case 6:this.DURATION=2; break;
      case 7: this.DURATION=3; break;
    }
    if(this.DURATION)
      return [[new Description(()=>`${target.name} has been paralized.`,[nextOption(this.masterService)])],[]];
    else
      return [[],[`${target.name} resisted the paralisis.`]];
  }
  onEffectEnded(target: Character): battleActionOutput
  { return [[],[`${target.name} is no loger paralized.`]]; }
  canApply(target:Character): boolean
  { return super.canApply(target) && target.roundStats.energyresistance<Math.random()*100; }
}
