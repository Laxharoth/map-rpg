import { pushBattleActionOutput } from 'src/gameLogic/custom/functions/htmlHelper.functions';
import { MasterService } from "src/app/service/master.service";
import { storeable } from "src/gameLogic/core/Factory/Factory";
import { Character } from 'src/gameLogic/custom/Class/Character/Character';
import { ActionOutput } from "src/gameLogic/custom/Class/Character/Character.type";
import { itemname } from "src/gameLogic/custom/Class/Items/Item.type";
import { tag } from "src/gameLogic/custom/customTypes/tags";
import { BattleUseable } from './BattleUseable';
import { GameElementDescriptionSection } from '../GameElementDescription/GameElementDescription';

/** Model of game items. */
export abstract class GameItem implements BattleUseable, storeable
{
  /** The max number of items than can be held in a single stack. */
  readonly maxStack: number = 9;
  /** The number of items in the stack. */
  amount: number = 1;
  basePrice: number = 0.0;
  protected readonly masterService: MasterService;
  /** Creates an instance of Item. */
  constructor(masterService:MasterService){this.masterService=masterService;}
  readonly abstract type:itemname;
  /** The name of the Item. */
  abstract get name(): string;
  /** If the Item can be used during a battle. */
  get isBattleUsable(): boolean {return true; }
  /** If the Item can be used only during a battle */
  get isMapUsable(): boolean {return true; }
  /** If the Item can be used on the player's party */
  get isPartyUsable(): boolean { return true; }
  /** If the Item can be used on the enemy's party' */
  get isEnemyUsable(): boolean { return false; }
  /** If the item can be used on the player */
  get isSelfUsable():   boolean { return true; }
  /** When the item is disabled. */
  disabled(user: Character): boolean { return false;}
  /** If the item is single target. */
  get isSingleTarget(): boolean { return true; }
  /** The action the item perform. */
  itemEffect(user:Character,targets: Character|Character[]):ActionOutput {
    const description :ActionOutput = [[],[]]
    if(!(targets instanceof Array))targets = [targets]
    this.amount--;
    if(this.amount<=0){ user.inventory.dropItem(this) }
    for(const target of targets)
    {
      pushBattleActionOutput(this._itemEffect(user,target),description);
      pushBattleActionOutput(target.react(this.tags,user),description);
    }
    return  description
  };

  protected abstract _itemEffect(user:Character,target: Character):ActionOutput;
  /** The tags associated with the item. */
  get tags(): tag[] {return []};
  breakIntoStacks():GameItem[]
  {
    const copy = Object.create(this);
    const stacks:GameItem[] = [];
    while(copy.amount>0)
    {
      const item = Object.create(copy);
      item.amount = Math.min(copy.amount,copy.maxStack);
      copy.amount-=item.amount;
      stacks.push(item);
    }
    return stacks;
  }
  /** Stores the amount of items in the stack. */
  toJson():ItemStoreable
  {
    return {Factory:"Item",type:this.type,amount:this.amount}
  }
  /** Loads the amount of items in the stack. */
  fromJson(options: ItemStoreable): void
  {
    const {amount=null,basePrice=null} = options;
    amount&&(this.amount = amount);
    basePrice&&(this.basePrice = basePrice);
  }
  private _description:GameElementDescriptionSection[];
  get description(): GameElementDescriptionSection[]
  {
    if(!this._description)
      this._description = [
        {name:"name",section_items:[{name:'name',value:this.name}]},
        ...this.added_description_sections,
        {name:"tags",section_items:this.tags.map(tag =>{return {name:'tag',value:tag}})}
      ]
    return this._description
  }
  protected get added_description_sections():GameElementDescriptionSection[]
  {
    return []
  }
}

export function fillItemStoreable(item_data:{type:itemname,[key:string]:any})
{
  const item_storeable:ItemStoreable = { Factory:"Item", type:item_data.type }
  item_storeable.amount = item_data?.amount;
  item_storeable.basePrice = item_data?.basePrice;
  return item_storeable
}
export type ItemStoreable ={
  Factory:"Item";
  type:itemname;
  amount?:number;
  basePrice?:number;
}
export interface TagsDescriptionSection
{
  name:'tags';
  section_items:{name:'tag';value:tag}[]
}
