import { EnergyStats, FullCalculatedStats, FullCoreStats } from '../Character/Character.type';
import { CharacterBattleClass, experience_cap } from './CharacterBattleClass';

export class TestCharacterBattleClass extends CharacterBattleClass {
  initial_core_stats: EnergyStats = {
    hitpoints: 100,
    energypoints: 100,
  };
  initial_physic_stats: FullCoreStats = {
    strenght: 20,
    stamina: 20,
    aim: 20,
    speed: 20,
    intelligence: 20,
  };
  experience_cap:experience_cap = [ 100,1000,2000,5000,10000 ]
  calculate_stats({ strenght, stamina, aim, speed, intelligence, }: FullCoreStats): FullCalculatedStats {
    return {
      physical_attack: Math.round(strenght + stamina / 2) || 0,
      ranged_attack: Math.round(aim / 2 + strenght / 8 + stamina / 8) || 0,
      physical_defence: Math.round(stamina) || 0,
      ranged_defence: Math.round(aim / 2 + stamina / 2) || 0,
      accuracy: Math.round(aim) || 0,
      evasion: Math.round(speed / 2) || 0,
      initiative: Math.round(speed + intelligence) || 0,
    }
  }
}
