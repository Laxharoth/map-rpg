import { FactoryFunction } from 'src/gameLogic/configurable/Factory/FactoryMap';
import { BattleClassOptions } from './../Class/CharacterBattleClass/CharacterBattleClass';
import { CharacterBattleClass, CharacterBattleClassEmpty } from "../Class/CharacterBattleClass/CharacterBattleClass";

/** Creates a battle class */
export const CharacterBattleClassFactory:FactoryFunction<CharacterBattleClass,BattleClassOptions> = (_,options)=>{
  return new characterBattleClassSwitcher[options.type]();
}
interface CharacterBattleClassFactoryConstructor{
  new ():CharacterBattleClass
}

export const characterBattleClassSwitcher:{[key:string]:CharacterBattleClassFactoryConstructor} = {
  CharacterBattleClassEmpty,
}
