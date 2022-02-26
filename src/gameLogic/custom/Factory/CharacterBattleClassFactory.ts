import { FactoryFunction } from 'src/gameLogic/configurable/Factory/FactoryMap';
import { BattleClassOptions } from './../Class/CharacterBattleClass/CharacterBattleClass';
import { CharacterBattleClass, CharacterBattleClassEmpty } from "../Class/CharacterBattleClass/CharacterBattleClass";

/** Creates a battle class */
export const CharacterBattleClassFactory:FactoryFunction<CharacterBattleClass,BattleClassOptions> = (_,options)=>{
  return new character_battle_class_switcher[options.type]();
}
interface CharacterBattleClassFactoryConstructor{
  new ():CharacterBattleClass
}

export const character_battle_class_switcher:{[key:string]:CharacterBattleClassFactoryConstructor} = {
  CharacterBattleClassEmpty,
}
