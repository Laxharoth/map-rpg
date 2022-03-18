import { Character } from "../Character/Character";

export interface DamageSource
{
  damageTypes:FullDamageTypes
  damagestat(user   : Character):number;
  defencestat(target: Character):number;
}

export function calculateDamage(damage_source: DamageSource,user:Character,target:Character):number
{
  let finalDamage:number = 0;
  const damageRelation = damage_source.damagestat(user) / damage_source.defencestat(target);
  finalDamage += (damageRelation * damage_source.damageTypes.slashdamage ||0 / (100 - target.calculated_resistance.slashresistance));
  finalDamage += (damageRelation * damage_source.damageTypes.bluntdamage ||0 / (100 - target.calculated_resistance.bluntresistance));
  finalDamage += (damageRelation * damage_source.damageTypes.piercedamage||0 / (100 - target.calculated_resistance.pierceresistance));
  finalDamage += (damageRelation * damage_source.damageTypes.poisondamage||0 / (100 - target.calculated_resistance.poisonresistance));
  finalDamage += (damageRelation * damage_source.damageTypes.heatdamage  ||0 / (100 - target.calculated_resistance.heatresistance));
  finalDamage += (damageRelation * damage_source.damageTypes.energydamage||0 / (100 - target.calculated_resistance.energyresistance));
  finalDamage += (damageRelation * damage_source.damageTypes.frostdamage ||0 / (100 - target.calculated_resistance.frostresistance));
  return Math.round(finalDamage)||0;
}
export interface DamageTypes {
  heatdamage ? : number;
  energydamage ? : number;
  frostdamage ? : number;
  slashdamage ? : number;
  bluntdamage ? : number;
  piercedamage ? : number;
  poisondamage ? : number;
}
export interface FullDamageTypes {
  heatdamage : number;
  energydamage : number;
  frostdamage : number;
  slashdamage : number;
  bluntdamage : number;
  piercedamage : number;
  poisondamage : number;
}
