import { MasterService } from 'src/app/service/master.service';
import { storeable } from 'src/gameLogic/core/Factory/Factory';
import { attack, DamageSource, DamageTypes } from 'src/gameLogic/custom/Class/Battle/DamageSource';
import { Character } from 'src/gameLogic/custom/Class/Character/Character';
import { ActionOutput } from 'src/gameLogic/custom/Class/Character/Character.type';
import { GameElementDescriptionSection } from 'src/gameLogic/custom/Class/GameElementDescription/GameElementDescription';
import { BattleUseable } from 'src/gameLogic/custom/Class/Items/BattleUseable';
import { specialsname } from 'src/gameLogic/custom/Class/Items/Item.type';
import { hashable } from 'src/gameLogic/custom/ClassHelper/ObjectSet';
import { tag } from 'src/gameLogic/custom/customTypes/tags';
import { pushBattleActionOutput, randomCheck } from 'src/gameLogic/custom/functions/htmlHelper.functions';

export abstract class SpecialAttack implements BattleUseable, hashable, storeable{
  abstract type:specialsname;
  abstract readonly name:string;
  protected masterService:MasterService;
  /** the cooldown time*/
  protected abstract readonly COOLDOWN:number;
  /** The remaining turns to finish cooldown */
  cooldown: number = 0;
  abstract isPartyUsable: boolean;
  abstract isEnemyUsable: boolean;
  abstract isSelfUsable : boolean;
  abstract isSingleTarget: boolean;
  get isBattleUsable(): boolean { return true; }
  get isMapUsable(): boolean { return true; }
  get tags():tag[]{ return []}
  itemEffect(user: Character, targets: Character | Character[]): ActionOutput {
    const description :ActionOutput = [[],[]]
    if(!(targets instanceof Array))targets = [targets]
    this.cooldown = this.COOLDOWN;
    for(const target of targets){
      pushBattleActionOutput(this._itemEffect(user,target),description);
    }
    return description;
  }
  protected abstract _itemEffect(user: Character, targets: Character): ActionOutput;
  disabled(user:Character): boolean { return this.cooldown > 0;}
  constructor(masterService:MasterService){this.masterService=masterService;}
  get description(): GameElementDescriptionSection[]{
    return [
      {type:"name",section_items:[{value:this.name}]},
      ...this.added_description_sections,
      {type:"sequence",name:"tags",section_items:this.tags.map(tag =>{return {value:tag}})},
      {type:"label",name:"cooldown",section_items:[{name:'cooldown',value:this.cooldown}]},
    ]
  }
  get added_description_sections():GameElementDescriptionSection[] { return [] }
  cool(){this.cooldown = Math.max(0,this.cooldown-1)}
  reset_initial_cooldown(){this.cooldown = 0;}
  hash(): string { return this.type }
  toJson(): SpecialAttackOptions {
      return {
        Factory: "SpecialAttack",
        type:this.type
      }
  }
  fromJson(options:SpecialAttackOptions){}
}
export abstract class DamageSpecialAttack extends SpecialAttack implements DamageSource{
  abstract damageTypes: DamageTypes;
  abstract damagestat(user: Character): number;
  abstract defencestat(target: Character): number;
  isPartyUsable: boolean = false;
  isEnemyUsable: boolean = true;
  isSelfUsable: boolean = false;
  didAttackMiss(source: Character, target: Character): boolean {
    return randomCheck(source.calculatedStats.accuracy-target.calculatedStats.evasion);
  }
  attackLanded(damage: number, user: Character, target: Character): ActionOutput {
    return [[],[`${user.name}'s ${this.name} deals ${damage} to ${target.name}`]]
  }
  attackMissed(user: Character, target: Character): ActionOutput {
    return [[],[`${user.name}'s ${this.name} missed ${target.name}`]]
  }
  protected _itemEffect(user: Character, targets: Character): ActionOutput {
    return attack(this,user,targets)
  }
}
export type SpecialAttackOptions = {
  Factory: "SpecialAttack",
  type:specialsname,
  [key:string]:any
}
