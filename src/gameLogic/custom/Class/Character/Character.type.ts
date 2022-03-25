import { Int } from './../../ClassHelper/Int';
import { Scene } from "src/gameLogic/custom/Class/Scene/Scene";


export interface EnergyStats {
  hitpoints : Int;
  energypoints : Int;
}
export interface LevelStats {
  experience:Int,
  upgrade_point:Int,
  perk_point:Int,
  level:Int,
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
  strenght:Int;
  stamina:Int;
  aim:Int;
  speed:Int;
  intelligence:Int;
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
  hitpoints : Int;
  energypoints : Int;
  physical_attack:Int;
  ranged_attack:Int;
  physical_defence:Int;
  ranged_defence:Int;
  accuracy:Int;
  evasion:Int;
  initiative:Int;
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
  heatresistance : Int;
  energyresistance : Int;
  frostresistance : Int;
  slashresistance : Int;
  bluntresistance : Int;
  pierceresistance : Int;
  poisonresistance : Int;
}

export type ActionOutput = [Scene[], string[]];
