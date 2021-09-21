import { Character } from 'src/app/classes/Character/Character';
import { characterType, CharacterTypeValues } from "src/app/customTypes/characterTypes";
import { MasterService } from "../../masterService";
import { charTest } from "../NPC/characterTest";
import { enemyTest } from "../NPC/enemyTest";
import { JohnSmith } from "../NPC/JohnSmit";

/**
 * Creates a character with the given characterType
 *
 * @export
 * @param {MasterService} masterService The master service
 * @param {characterType} characterType The character type
 * @param {{[key: string]:any}} options The options from the character created with the  storeable.toJson
 * @return {Character} A character with the loaded options.
 */
export function CharacterFactory(masterService:MasterService,characterType:characterType,options:{[key: string]:any}):Character
{
  const character = CharacterSwitcher[characterType](masterService)
  character.fromJson(options);
  return character;
}

/** @type {{[key:string]:(masterService:MasterService)=>Character}} A 'list' of functions to create characters*/
const CharacterSwitcher:{[key in CharacterTypeValues]:(masterService:MasterService)=>Character} = {
  'test character':(masterService:MasterService)=>new charTest(masterService,''),
  'test enemy':(masterService:MasterService)=>new enemyTest(masterService),
  'john':(masterService:MasterService)=>new JohnSmith(masterService),
}
