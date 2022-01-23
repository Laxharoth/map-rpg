import { FactoryFunction } from "src/gameLogic/configurable/Factory/FactoryMap";
import { CharacterBattleClass, CharacterBattleClassEmpty } from "../Class/CharacterBattleClass/CharacterBattleClass";

export const CharacterBattleClassFactory:FactoryFunction<CharacterBattleClass> = (_,options)=>{
  return new character_battle_class_switcher[options.type]();
}
interface CharacterBattleClassFactoryConstructor{
  new ():CharacterBattleClass
}

export const character_battle_class_switcher:{[key:string]:CharacterBattleClassFactoryConstructor} = {
  CharacterBattleClassEmpty,
}
