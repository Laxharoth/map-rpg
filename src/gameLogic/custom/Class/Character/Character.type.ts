import { Int } from './../../ClassHelper/Int';
import { Scene } from "src/gameLogic/custom/Class/Scene/Scene";


export interface EnergyStats {
  hitpoints : Int;
  energypoints : Int;
}
export interface LevelStats {
  experience:Int,
  upgradePoint:Int,
  perkPoint:Int,
  level:Int,
  upgradePath:number[],
}
export interface CoreStats{
  strenght?:number;
  stamina?:number;
  aim?:number;
  speed?:number;
  intelligence?:number;
}
export interface FullCoreStats extends CoreStats{
  strenght:Int;
  stamina:Int;
  aim:Int;
  speed:Int;
  intelligence:Int;
}
export interface CalculatedStats {
  hitpoints ?: number;
  energypoints ?: number;
  physicalAttack?:number;
  rangedAttack?:number;
  physicalDefence?:number;
  rangedDefence?:number;
  accuracy?:number;
  evasion?:number;
  initiative?:number;
}
export interface FullCalculatedStats extends CalculatedStats {
  hitpoints : Int;
  energypoints : Int;
  physicalAttack:Int;
  rangedAttack:Int;
  physicalDefence:Int;
  rangedDefence:Int;
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
