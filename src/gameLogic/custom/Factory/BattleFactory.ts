import { FactoryFunction } from './../../configurable/Factory/FactoryMap';
import { Battle, BattleOptions } from './../Class/Battle/Battle';

/** Creates an Quest with the */
export const BattleFactory:FactoryFunction<Battle,BattleOptions> = (masterService,options)=>{
  const battle = new Battle( masterService,options.enemy );
  battle.fromJson(options);
  return battle;
}
