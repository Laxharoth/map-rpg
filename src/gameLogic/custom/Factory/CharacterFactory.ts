import { MasterService } from "src/app/service/master.service";
import { UniqueCharacterStoreable } from "src/gameLogic/custom/Class/Character/UniqueCharacter";
import { MainCharacter } from 'src/gameLogic/custom/Class/Character/MainCharacter/MainCharacter';
import { Character } from "../Class/Character/Character";
import { FactoryFunction } from "src/gameLogic/configurable/Factory/FactoryMap";

/** Creates a character */
export const CharacterFactory:FactoryFunction<Character,UniqueCharacterStoreable> = (masterService,options)=>{
  if(!character_switcher[options.type]){
    console.warn(`Character type ${options.type} not found`);
    options.name = options.type;
    options.type = "test character";
  }
  const character = new character_switcher[options.type](masterService)
  character.fromJson(options);
  return character;
}
export const character_switcher:{[key: string]:CharacterConstructor}= {
  'main-character':MainCharacter,
}
export interface CharacterConstructor { new (masterService:MasterService):Character }
export enum CharacterTypeValues{
  'test enemy'='test enemy',
  'Bandit'='Bandit',
  'Guard'='Guard',
  'DragonSeller'='DragonSeller',
  'Thug'='Thug',
  'test character'='test character',
  'john'='john',
  'main-character'='main-character',
  'FrankiePeanuts'='FrankiePeanuts',
  'BishopVault'='BishopVault',
  'Timber'='Timber',
}
export type characterType = `${CharacterTypeValues}`;
