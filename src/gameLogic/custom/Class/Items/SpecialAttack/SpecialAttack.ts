import { hashable } from 'src/gameLogic/custom/ClassHelper/ObjectSet';
import { MasterService } from "src/app/service/master.service";
import { Character } from "src/gameLogic/custom/Class/Character/Character";
import { specialsname } from "src/gameLogic/custom/Class/Items/Item.type";
import { tag } from "src/gameLogic/custom/customTypes/tags";
import { pushBattleActionOutput } from "src/gameLogic/custom/functions/htmlHelper.functions";
import { ActionOutput } from "../../Character/Character.type";
import { GameElementDescriptionSection } from "../../GameElementDescription/GameElementDescription";
import { BattleUseable } from "../BattleUseable";
import { storeable, StoreableType } from 'src/gameLogic/core/Factory/Factory';

export abstract class SpecialAttack implements BattleUseable, hashable, storeable
{
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
    for(const target of targets)
    {
      pushBattleActionOutput(this._itemEffect(user,target),description);
      pushBattleActionOutput(target.react(this.tags,user),description);
    }
    return description;
  }
  protected abstract _itemEffect(user: Character, targets: Character): ActionOutput;
  disabled(user:Character): boolean { return this.cooldown > 0;}
  constructor(masterService:MasterService){this.masterService=masterService;}
  get description(): GameElementDescriptionSection[]
  {
    return [
      {name:"name",section_items:[{name:'name',value:this.name}]},
      ...this.added_description_sections,
      {name:"tags",section_items:this.tags.map(tag =>{return {name:'tag',value:tag}})},
      {name:"cooldown",section_items:[{name:'cooldown',value:this.cooldown}]},
    ]
  }
  get added_description_sections():GameElementDescriptionSection[] { return [] }
  cool(){this.cooldown = Math.max(0,this.cooldown-1)}
  reset_initial_cooldown(){this.cooldown = 0;}
  hash(): string { return this.name }
  toJson(): SpecialAttackOptions {
      return {
        Factory: "SpecialAttack",
        type:this.name
      }
  }
  fromJson(options:SpecialAttackOptions){}
}
export type SpecialAttackOptions = {
  Factory: "SpecialAttack",
  type:string,
  [key:string]:any
}
