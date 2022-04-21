import { pushBattleActionOutput } from "../../functions/htmlHelper.functions";
import { Character } from "../Character/Character";
import { ActionOutput } from "../Character/Character.type";

export interface DamageSource{
  damageTypes:DamageTypes;
  damagestat(user   : Character):number;
  defencestat(target: Character):number;
  didAttackMiss(source:Character, target:Character):boolean;
  attackLanded(damage:number,user:Character,target:Character):ActionOutput;
  attackMissed(user:Character,target:Character):ActionOutput;
  onAttackMissed?:(user:Character,target:Character)=>ActionOutput;
  onAttackLanded?:(user:Character,target:Character)=>ActionOutput;
}
export function calculateDamage(damage_source: DamageSource,user:Character,target:Character):number{
  let finalDamage:number = 0;
  const damageRelation = damage_source.damagestat(user) / damage_source.defencestat(target);
  finalDamage += (damageRelation * ( damage_source.damageTypes.slashdamage || 0 ) / ( 100 - target.calculatedResistance.slashresistance ) );
  finalDamage += (damageRelation * ( damage_source.damageTypes.bluntdamage || 0 ) / ( 100 - target.calculatedResistance.bluntresistance ) );
  finalDamage += (damageRelation * ( damage_source.damageTypes.piercedamage|| 0 ) / ( 100 - target.calculatedResistance.pierceresistance ) );
  finalDamage += (damageRelation * ( damage_source.damageTypes.poisondamage|| 0 ) / ( 100 - target.calculatedResistance.poisonresistance ) );
  finalDamage += (damageRelation * ( damage_source.damageTypes.heatdamage  || 0 ) / ( 100 - target.calculatedResistance.heatresistance ) );
  finalDamage += (damageRelation * ( damage_source.damageTypes.energydamage|| 0 ) / ( 100 - target.calculatedResistance.energyresistance ) );
  finalDamage += (damageRelation * ( damage_source.damageTypes.frostdamage || 0 ) / ( 100 - target.calculatedResistance.frostresistance ) );
  return Math.round(finalDamage)||0;
}
export function attack(damageSource:DamageSource,source:Character,target:Character){
  if(damageSource.didAttackMiss(source,target)){
    return pushBattleActionOutput(
      damageSource.onAttackMissed?.(source,target)||[[],[]],
      damageSource.attackMissed(source,target)
    )
  }
  const damage = calculateDamage(damageSource,source,target);
  return pushBattleActionOutput(
    damageSource.onAttackLanded?.(source,target)||[[],[]],
    damageSource.attackLanded(damage,source,target)
  )
}
export interface DamageTypes {
  heatdamage ? : number;
  energydamage ? : number;
  frostdamage ? : number;
  slashdamage ? : number;
  bluntdamage ? : number;
  piercedamage ? : number;
  poisondamage ? : number;
  fixeddamage ? : number;
}
export interface FullDamageTypes {
  heatdamage : number;
  energydamage : number;
  frostdamage : number;
  slashdamage : number;
  bluntdamage : number;
  piercedamage : number;
  poisondamage : number;
  fixeddamage : number;
}
