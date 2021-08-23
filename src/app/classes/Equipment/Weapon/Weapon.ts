import { battleActionOutput, damageTypes } from './../../../customTypes/customTypes';
import { Character } from "../../Character/Character";
import { Equipment } from "../Equipment";
import { randomBetween } from 'src/app/htmlHelper/htmlHelper.functions';

export abstract class Weapon extends Equipment
{
  protected abstract damageTypes:damageTypes;
  protected abstract accuracy:number;
  attack(user:Character,target:Character):battleActionOutput
  {
    if(this.accuracyTest(target) < 0 )
    {return [[],[`${user.name} attacke ${target.name} but missed`]];}
    const damage = this.calculateDamage(user, target);
    target.stats.hitpoints-=damage;
    return [[],[`${target.name} takes ${damage} damage from ${user.name}'s ${this.name}`]];
  }
  protected abstract damagestat(user   : Character):number;
  protected abstract defencestat(target: Character):number;
  protected calculateDamage(user:Character,target:Character):number
  {
    let finalDamage:number = 0;
    const damageRelation = this.damagestat(user) / this.defencestat(target);
    finalDamage += (damageRelation * this.damageTypes.slashdamage||0  / (100 - target.roundStats.slashresistance));
    finalDamage += (damageRelation * this.damageTypes.bluntdamage||0  / (100 - target.roundStats.bluntresistance));
    finalDamage += (damageRelation * this.damageTypes.piercedamage||0 / (100 - target.roundStats.pierceresistance));
    finalDamage += (damageRelation * this.damageTypes.poisondamage||0 / (100 - target.roundStats.poisonresistance));
    finalDamage += (damageRelation * this.damageTypes.heatdamage||0   / (100 - target.roundStats.heatresistance));
    finalDamage += (damageRelation * this.damageTypes.energydamage||0 / (100 - target.roundStats.energyresistance));
    finalDamage += (damageRelation * this.damageTypes.frostdamage||0  / (100 - target.roundStats.frostresistance));
    return Math.round(finalDamage);
  }
  protected accuracyTest(target:Character): number {
    const check = randomBetween(0,100+this.accuracy);
    return check - target.roundStats.evasion;
  }
}
