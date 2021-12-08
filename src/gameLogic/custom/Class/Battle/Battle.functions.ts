import { Character } from 'src/gameLogic/custom/Class/Character/Character';

export function getUndefeatedTarget(group:Character[]):Character[]
{ return group.filter(character => character.currentCoreStats.hitpoints>0); }

export function attackOrder(characters:Character[]):Character[] {
  return characters.sort((character,other)=> character.stats.speed > other.stats.speed ? -1:1)
}
