import { Character } from 'src/gameLogic/custom/Class/Character/Character';

export function get_undefeated_target(group:Character[]):Character[]
{ return group.filter(character => character.current_energy_stats.hitpoints>0); }

export function attack_order(characters:Character[]):Character[] {
  return characters.sort((character,other)=> character.calculated_stats.initiative > other.calculated_stats.initiative ? -1:1)
}