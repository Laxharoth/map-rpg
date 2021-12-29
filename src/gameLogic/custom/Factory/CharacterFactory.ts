import { MasterService } from "src/app/service/master.service";
import { CharacterStoreable, UniqueCharacter } from "src/gameLogic/custom/Class/Character/UniqueCharacter";
import { MainCharacter } from 'src/gameLogic/custom/Class/Character/MainCharacter/MainCharacter';
import { charTest } from "src/gameLogic/custom/Class/Character/NPC/characterTest";
import { JohnSmith } from "src/gameLogic/custom/Class/Character/NPC/JohnSmit";
import { UniqueCharacterType } from "src/gameLogic/custom/Factory/CharacterFactory.type";

/**
 * Creates a character with the given characterType
 *
 * @export
 * @param {MasterService} masterService The master service
 * @param {CharacterStoreable} options The options from the character created with the  storeable.toJson
 * @return {Character} A character with the loaded options.
 */
export function CharacterFactory(masterService:MasterService,options:CharacterStoreable):UniqueCharacter
{
  const character = CharacterSwitcher[options.type](masterService)
  character.fromJson(options);
  return character;
}

/** @type {{[key:string]:(masterService:MasterService)=>UniqueCharacter}} A 'list' of functions to create characters*/
const CharacterSwitcher:{[key in UniqueCharacterType]:(masterService:MasterService)=>UniqueCharacter} = {
  'test character':(masterService:MasterService)=>new charTest(masterService,''),
  'john':(masterService:MasterService)=>new JohnSmith(masterService),
  'main-character':(masterService:MasterService)=>new MainCharacter(masterService,''),
}
