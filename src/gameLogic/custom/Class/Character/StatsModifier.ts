import { Int, roundToInt } from "../../ClassHelper/Int";
import { Character } from "./Character";
import { CalculatedStats, ResistanceStats } from "./Character.type";

export interface StatsModifier{
  statsModifier?: CalculatedStats;
  resistanceStats?: ResistanceStats;
}
/** Applies stat modifiers to a character. */
export function applyModifiers(character:Character, modifiers:StatsModifier):void{
  const characterStats = character.calculated_stats as unknown as { [key:string]: Int};
  const statsModifier = modifiers.statsModifier as unknown as { [key:string]: Int} | undefined;
  if(statsModifier)
  for(const key of Object.keys(statsModifier)){
    characterStats[key] = roundToInt(characterStats[key]+statsModifier[key]);
  }
  const characterResistance = character.calculated_resistance as unknown as { [key:string]: Int};
  const resistanceModifier = modifiers.resistanceStats as unknown as { [key:string]: Int} | undefined;
  if(resistanceModifier)
  for(const key of Object.keys(resistanceModifier)){
    characterResistance[key] = roundToInt(characterResistance[key]+resistanceModifier[key]);
  }
}
/** Removes stat modifiers to a character. */
export function removeModifier(character:Character,modifiers:StatsModifier):void{
  const characterStats = character.calculated_stats as unknown as { [key:string]: Int};
  const statsModifier = modifiers.statsModifier as unknown as { [key:string]: Int};
  for(const key of Object.keys(statsModifier)){
    characterStats[key] = roundToInt(characterStats[key]-statsModifier[key]);
  }
  const characterResistance = character.calculated_resistance as unknown as { [key:string]: Int};
  const resistanceModifier = modifiers.resistanceStats as unknown as { [key:string]: Int};
  for(const key of Object.keys(resistanceModifier)){
    characterResistance[key] = roundToInt(characterResistance[key]-resistanceModifier[key]);
  }
}
