import { MasterService } from "src/app/service/master.service";
import { Character, CharacterStoreable } from "src/gameLogic/custom/Class/Character/Character";
import { MainCharacter } from 'src/gameLogic/custom/Class/Character/MainCharacter/MainCharacter';
import { charTest } from "src/gameLogic/custom/Class/Character/NPC/characterTest";
import { enemyTest } from "src/gameLogic/custom/Class/Character/NPC/enemyTest";
import { JohnSmith } from "src/gameLogic/custom/Class/Character/NPC/JohnSmit";
import { characterType, CharacterTypeValues } from "src/gameLogic/custom/Factory/CharacterFactory.type";

/**
 * Creates a character with the given characterType
 *
 * @export
 * @param {MasterService} masterService The master service
 * @param {characterType} characterType The character type
 * @param {{[key: string]:any}} options The options from the character created with the  storeable.toJson
 * @return {Character} A character with the loaded options.
 */
export function CharacterFactory(masterService:MasterService,options:CharacterStoreable):Character
{
  const character = CharacterSwitcher[options.type](masterService)
  character.fromJson(options);
  return character;
}

/** @type {{[key:string]:(masterService:MasterService)=>Character}} A 'list' of functions to create characters*/
const CharacterSwitcher:{[key in CharacterTypeValues]:(masterService:MasterService)=>Character} = {
  'test character':(masterService:MasterService)=>new charTest(masterService,''),
  'test enemy':(masterService:MasterService)=>new enemyTest(masterService),
  'john':(masterService:MasterService)=>new JohnSmith(masterService),
  'main-character':(masterService:MasterService)=>new MainCharacter(masterService,''),
}
