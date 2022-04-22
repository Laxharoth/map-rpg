import { calculateDamage, DamageSource, DamageTypes } from 'src/gameLogic/custom/Class/Battle/DamageSource';
import { Character } from 'src/gameLogic/custom/Class/Character/Character';
import { ActionOutput } from "src/gameLogic/custom/Class/Character/Character.type";
import { Equipment } from "src/gameLogic/custom/Class/Equipment/Equipment";
import { GameElementDescriptionSection
       } from 'src/gameLogic/custom/Class/GameElementDescription/GameElementDescription';
import { weaponname } from 'src/gameLogic/custom/Class/Items/Item.type';
import { randomBetween } from 'src/gameLogic/custom/functions/htmlHelper.functions';

/** Type of equipment that can attack. */
export abstract class Weapon extends Equipment implements DamageSource{
  /** The damage types associated with this weapon. */
  protected _damageTypes:DamageTypes = {};
  get damageTypes(){ return this._damageTypes; }
  readonly abstract type: weaponname;
  abstract get name():string;
  missRate=10;
  attackLanded(damage: number,user:Character,target:Character): ActionOutput {
    return [[],[`${target.name} takes ${damage} damage from ${user.name}'s ${this.name}`]];
  }
  attackMissed(user:Character,target:Character):ActionOutput{
    return [[],[`${user.name} attack ${target.name} but missed`]];
  }
  /** Gets the stat from the character that will be used to calculate the damage. */
  abstract damagestat(user   : Character):number;
  /** Gets the stat from the character that will be used to calculate the reduction of damage. */
  abstract defencestat(target: Character):number;
  /** Calculated the damage based on the weapon damage types. */
  protected calculateDamage(user:Character,target:Character):number
  { return calculateDamage(this,user,target); }
  /** Check if the attack is successful. */
  didAttackMiss(user:Character,target:Character): boolean {
    const check = randomBetween(-this.missRate,user.calculatedStats.accuracy);
    return check < 0;
  }
  get addedDescriptionSections():GameElementDescriptionSection[]{
    const damageStatsDescription:GameElementDescriptionSection={type:"list",name:"damage",section_items:[]};
    if(Math.max(...Object.values(this.damageTypes)))
    for(const [stat,value] of Object.entries(this.damageTypes)){
      if(value===0)continue;
      // @ts-ignore
      damageStatsDescription.section_items.push({name:aliasDamageType[stat],value});
    }
    return  [
      damageStatsDescription,
      ...super.addedDescriptionSections
    ]
  }
}
const aliasDamageType={
  "heatdamage"   : "heat  ",
  "energydamage" : "energy",
  "frostdamage"  : "frost ",
  "slashdamage"  : "slash ",
  "bluntdamage"  : "blunt ",
  "piercedamage" : "pierce",
  "poisondamage" : "poison",
}
