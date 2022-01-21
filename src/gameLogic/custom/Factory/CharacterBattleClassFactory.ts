import { FactoryFunction } from "src/gameLogic/configurable/Factory/FactoryMap";
import { CharacterBattleClass } from "../Class/CharacterBattleClass/CharacterBattleClass";
import { TestCharacterBattleClass } from "../Class/CharacterBattleClass/testCharacterBattleClass";
import { TestMainCharacterBattleClass } from "../Class/CharacterBattleClass/testMainCharacterBattleClass";

export const CharacterBattleClassFactory:FactoryFunction<CharacterBattleClass> = (_,options)=>{
  return new character_battle_class_switcher[options.type]();
}
interface CharacterBattleClassFactoryConstructor{
  new ():CharacterBattleClass
}
const character_battle_class_switcher:{[key:string]:CharacterBattleClassFactoryConstructor} = {
  TestCharacterBattleClass:TestCharacterBattleClass,
  TestMainCharacterBattleClass:TestMainCharacterBattleClass
}
