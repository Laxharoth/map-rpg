import { Scene } from "src/gameLogic/custom/Class/Scene/Scene";


export interface EnergyStats {
  hitpoints : number;
  energypoints : number;
}
export interface LevelStats {
  experience:number,
  upgrade_point:number,
  perk_point:number,
  level:number,
  upgrade_path:number[],
}
export interface CoreStats {
  strenght?:number;
  stamina?:number;
  aim?:number;
  speed?:number;
  intelligence?:number;
}
export interface FullCoreStats extends CoreStats
{
  strenght:number;
  stamina:number;
  aim:number;
  speed:number;
  intelligence:number;
}
export interface CalculatedStats {
  hitpoints ?: number;
  energypoints ?: number;
  physical_attack?:number;
  ranged_attack?:number;
  physical_defence?:number;
  ranged_defence?:number;
  accuracy?:number;
  evasion?:number;
  initiative?:number;
}
export interface FullCalculatedStats extends CalculatedStats {
  hitpoints : number;
  energypoints : number;
  physical_attack:number;
  ranged_attack:number;
  physical_defence:number;
  ranged_defence:number;
  accuracy:number;
  evasion:number;
  initiative:number;
}
export interface ResistanceStats {
  heatresistance ? : number;
  energyresistance ? : number;
  frostresistance ? : number;
  slashresistance ? : number;
  bluntresistance ? : number;
  pierceresistance ? : number;
  poisonresistance ? : number;
}
export interface FullResistanceStats {
  heatresistance : number;
  energyresistance : number;
  frostresistance : number;
  slashresistance : number;
  bluntresistance : number;
  pierceresistance : number;
  poisonresistance : number;
}

export type ActionOutput = [Scene[], string[]];
