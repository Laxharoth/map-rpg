import {  EnergyStats, FullCalculatedStats, FullCoreStats, FullResistanceStats, LevelStats } from "src/gameLogic/custom/Class/Character/Character.type";

export abstract class CharacterBattleClass {
  abstract initial_core_stats: EnergyStats;
  abstract initial_physic_stats: FullCoreStats;
  initial_resistance_stats: FullResistanceStats = {
    heatresistance: 0,
    energyresistance: 0,
    frostresistance: 0,
    slashresistance: 0,
    bluntresistance: 0,
    pierceresistance: 0,
    poisonresistance: 0,
  };

  abstract experience_cap:experience_cap;

  total_experience_to_next_level(level:number):number
  {
    return this.experience_cap[level]||0;
  }
  current_level_experience(level_stats:LevelStats):number
  {
    return level_stats.experience - this.total_experience_to_next_level(level_stats.level-1)
  }

  calculate_stats({
    strenght,
    stamina,
    aim,
    speed,
    intelligence,
  }: FullCoreStats): FullCalculatedStats {
    return {
      physical_attack: 0,
      ranged_attack: 0,
      physical_defence: 0,
      ranged_defence: 0,
      accuracy: 0,
      evasion: 0,
      initiative: 0,
    }
  }
}

export type experience_cap = [number, number, number, number, number];
