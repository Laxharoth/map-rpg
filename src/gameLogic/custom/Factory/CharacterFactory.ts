import { MasterService } from "src/app/service/master.service";
import { UniqueCharacterStoreable } from "src/gameLogic/custom/Class/Character/UniqueCharacter";
import { MainCharacter } from 'src/gameLogic/custom/Class/Character/MainCharacter/MainCharacter';
import { charTest } from "src/gameLogic/custom/Class/Character/NPC/characterTest";
import { JohnSmith } from "src/gameLogic/custom/Class/Character/NPC/JohnSmit";
import { Character } from "../Class/Character/Character";
import { FactoryFunction } from "src/gameLogic/configurable/Factory/FactoryMap";

/** Creates a character */
export const CharacterFactory:FactoryFunction<Character,UniqueCharacterStoreable> = (masterService,options)=>{
  const character = new character_switcher[options.type](masterService)
  character.fromJson(options);
  return character;
}
// TODO Test load characters
export const character_switcher:{[key: string]:CharacterConstructor}= {
  'test character':charTest,
  'john':JohnSmith,
  'main-character':MainCharacter,
}
export interface CharacterConstructor { new (masterService:MasterService):Character }
export enum CharacterTypeValues{
  'test enemy'='test enemy',
}
export enum UniqueCharacterType{
  'test character'='test character',
  'john'='john',
  'main-character'='main-character',
}
export type characterType = `${CharacterTypeValues}`|`${UniqueCharacterType}`;
