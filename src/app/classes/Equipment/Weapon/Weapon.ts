import { ActionOutput, damageTypes } from './../../../customTypes/customTypes';
import { Character } from "../../Character/Character";
import { Equipment } from "../Equipment";
import { loadWeaponDamage, pushBattleActionOutput, randomBetween } from 'src/app/htmlHelper/htmlHelper.functions';
import { MasterService } from '../../masterService';

export abstract class Weapon extends Equipment
{
  protected damageTypes:damageTypes;
  protected abstract accuracy:number;
  /**
   * Should be overriden
   * @param masterService should be added to the child contructor parameters
   * @param damageTypes The damage stats of the weapon SHOULD NOT BE ADDED TO CHILD CONSTRUCTOR PARAMETERS
   */
  constructor(masterService:MasterService, damageTypes:damageTypes)
  {
    super(masterService)
    this.damageTypes = loadWeaponDamage(damageTypes)
  }
  attack(user:Character,target:Character):ActionOutput
  {
    if(this.accuracyTest(user,target) < 0 )
    {return [[],[`${user.name} attack ${target.name} but missed`]];}
    const [descriptions,strings]:ActionOutput = [[],[]];
    const damage = this.calculateDamage(user, target);
    target.takeDamage(damage);
    strings.push(`${target.name} takes ${damage} damage from ${user.name}'s ${this.name}`)
    pushBattleActionOutput(target.react(this.tags,user),[descriptions,strings]);
    return [descriptions,strings];
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
    return Math.round(finalDamage)||0;
  }
  protected accuracyTest(user:Character,target:Character): number {
    let [minaccuracy,maxaccuracy] = [0,100];
    if(user.hasTag('blind')) maxaccuracy -= 20;
    if(user.hasTag('aim')) maxaccuracy += 20;
    const check = randomBetween(minaccuracy,maxaccuracy+this.accuracy);
    return check - target.roundStats.evasion;
  }
}
