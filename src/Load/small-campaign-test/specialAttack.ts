import { register_function } from "src/gameLogic/core/Factory/Register_Module/RegisterModule";
import { DamageTypes } from "src/gameLogic/custom/Class/Battle/DamageSource";
import { Character } from "src/gameLogic/custom/Class/Character/Character";
import { ActionOutput } from "src/gameLogic/custom/Class/Character/Character.type";
import { specialsname } from "src/gameLogic/custom/Class/Items/Item.type";
import { SpecialAttack } from "src/gameLogic/custom/Class/Items/SpecialAttack/SpecialAttack";
import { perkname } from "src/gameLogic/custom/Class/Perk/Perk.type";
import { tag } from "src/gameLogic/custom/customTypes/tags";
import { StatusFactoryFuctioin } from "src/gameLogic/custom/Factory/StatusFactory";

const register:register_function = ({special_attack,perk}, {special_attack:{SpecialAttack,DamageSpecialAttack},perk:{Perk}}, Factory)=>{
  const statusFactory = Factory as StatusFactoryFuctioin;

  class SneakAttack extends SpecialAttack{
    type: specialsname = "SneakAttack";
    name: string = "Sneak Attack"
    protected COOLDOWN: number = 5;
    isPartyUsable: boolean = false;
    isEnemyUsable: boolean = false;
    isSelfUsable: boolean  = true ;
    isSingleTarget: boolean= true ;
    protected _itemEffect(user: Character, targets: Character): ActionOutput {
      return targets.addStatus(statusFactory(this.masterService,{ Factory:"Status",type:"Hide" }))
    }
  }
  class SneakAttackPerk extends Perk{
    type: perkname = "SneakAttack";
    readonly sneakAttack  = new SneakAttack(this.masterService)
    get name(): string { return "Sneak Attack"; }
    get specials(): SpecialAttack[] { return [this.sneakAttack]; }
  }
  class MultiAttack extends SpecialAttack {
    type: specialsname = "MultiAttack";
    name: string = "Multi Attack" ;
    protected COOLDOWN: number = 5;
    isPartyUsable: boolean = false;
    isEnemyUsable: boolean = true;
    isSelfUsable: boolean = false;
    isSingleTarget: boolean = true;
    protected _itemEffect(user: Character, targets: Character): ActionOutput {
      this.userWeaponTags  = user.character_equipment.meleeWeapon.tags;
      return Factory.pushBattleActionOutput(
        user.Attack([targets]).excecute(),
        user.Attack([targets]).excecute()
      );
    }
    private userWeaponTags:tag[]=[];
    get tags(): tag[] {
      return this.userWeaponTags;
    }
  }
  class MultiAttackPerk extends Perk{
    readonly multyAttack = new MultiAttack(this.masterService);
    get name(): string { return "Multi-Attack"; }
    type: perkname = "MultiAttack";
    get specials(): SpecialAttack[] {
      return [this.multyAttack];
    }
  }
  class SacredFlame extends DamageSpecialAttack{
    damageTypes: DamageTypes={
      heatdamage:100
    };
    damagestat(user: Character): number {
      return user.calculated_stats.accuracy * user.core_stats.intelligence;
    }
    defencestat(target: Character): number {
      return target.calculated_stats.evasion * target.core_stats.intelligence;
    }
    type: specialsname = "SacredFlame";
    name = "Sacred Flame";
    protected COOLDOWN: number = 5;
    isSingleTarget: boolean = false;
  }
  class SacredFlamePerk extends Perk{
    type: perkname = "SacredFlame";
    get name(): string { return "Sacred Flame"; }
    readonly sacredFlame = new SacredFlame(this.masterService);
    get specials(){
      return [this.sacredFlame];
    }
  }
  class Mending extends SpecialAttack{
    type: "Mending" = "Mending";
    name: string = "Mending";
    protected COOLDOWN: number = 5;
    isPartyUsable: boolean = true;
    isEnemyUsable: boolean = false;
    isSelfUsable: boolean = true;
    isSingleTarget: boolean = true;
    protected _itemEffect(user: Character, targets: Character): ActionOutput {
      const quarterHitpoints = targets.calculated_stats.hitpoints/4;
      const variant = quarterHitpoints / 4;
      const healed = targets.healHitPoints( Factory.randomBetween(quarterHitpoints-variant,quarterHitpoints+variant) );
      return [[],[
        `${user.name} healed ${targets.name} by ${healed} points`
      ]];
    }

  }
  class MendingPerk extends Perk{
    type: "Mending" = "Mending";
    get name(): string { return "Mending"; }
    readonly mending = new Mending(this.masterService);
    get specials(){ return [this.mending]}
  }
  class Guidance extends SpecialAttack{
    type: "Guidance" = "Guidance";
    name: string = "Guidance";
    protected COOLDOWN: number = 5;
    isPartyUsable: boolean = true;
    isEnemyUsable: boolean = false;
    isSelfUsable: boolean = true;
    isSingleTarget: boolean = true;
    protected _itemEffect(user: Character, targets: Character): ActionOutput {
      return targets.addStatus( statusFactory( this.masterService,{ Factory:"Status", type:"Guidance" }) );
    }
  }
  class GuidancePerk extends Perk{
    type: "Guidance" = "Guidance";
    get name(): string { return "Guidance"; }
    readonly mending = new Mending(this.masterService);
    get specials(){ return [this.mending]}
  }
  special_attack["SneakAttack"]=SneakAttack;
  perk["SneakAttack"]=SneakAttackPerk;
  special_attack["MultiAttack"]=MultiAttack;
  perk["MultiAttack"]=MultiAttackPerk;
  special_attack["SacredFlame"]=SacredFlame;
  perk["SacredFlame"]=SacredFlamePerk;
  special_attack["Mending"]=Mending;
  perk["Mending"]=MendingPerk;
  special_attack["Guidance"]=Guidance;
  perk["Guidance"]=GuidancePerk;
}
const module_name = "small-campaign-special-attack";
const module_dependency:string[] = ["small-campaign-status"];
export { register, module_name, module_dependency };
