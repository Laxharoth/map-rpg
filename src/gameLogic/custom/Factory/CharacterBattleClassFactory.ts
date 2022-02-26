import { BattleClassOptions } from './../Class/CharacterBattleClass/CharacterBattleClass';
import { MasterService } from "src/app/service/master.service";
import { CharacterBattleClass, CharacterBattleClassEmpty } from "../Class/CharacterBattleClass/CharacterBattleClass";

export const CharacterBattleClassFactory = (_: MasterService,options:BattleClassOptions)=>{
  return new character_battle_class_switcher[options.type]();
}
interface CharacterBattleClassFactoryConstructor{
  new ():CharacterBattleClass
}

export const character_battle_class_switcher:{[key:string]:CharacterBattleClassFactoryConstructor} = {
  CharacterBattleClassEmpty,
}
