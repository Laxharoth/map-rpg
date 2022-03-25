import { FactoryFunction } from './../../configurable/Factory/FactoryMap';
import { Battle, BattleOptions } from './../Class/Battle/Battle';

/** Creates an Quest with the */
export const BattleFactory:FactoryFunction<Battle,BattleOptions> = (master_service,options)=>{
  const battle = new Battle( master_service,options.enemy );
  battle.fromJson(options);
  return battle;
}
