import { removeItem } from 'src/gameLogic/custom/functions/htmlHelper.functions';
import { pushBattleActionOutput } from 'src/gameLogic/custom/functions/htmlHelper.functions';
import { MasterService } from "src/app/service/master.service";
import { storeable } from "src/gameLogic/core/Factory/Factory";
import { Character } from 'src/gameLogic/custom/Class/Character/Character';
import { ActionOutput } from "src/gameLogic/custom/Class/Character/Character.type";
import { itemname } from "src/gameLogic/custom/Class/Items/Item.type";
import { tag } from "src/gameLogic/custom/customTypes/tags";
import { BattleUseable } from './BattleUseable';
import { GameElementDescriptionSection } from '../GameElementDescription/GameElementDescription';

/**
 * Model of game items.
 *
 * @export
 * @abstract
 * @class Item
 * @implements {storeable}
 * @constructor Initializes the masterService
 */
export abstract class GameItem implements BattleUseable, storeable
{
  /**
   * The max number of items than can be held in a single stack.
   *
   * @type {number}
   * @memberof Item
   */
  readonly maxStack: number = 9;
  /**
   * The number of items in the stack.
   *
   * @type {number}
   * @memberof Item
   */
  amount: number = 1;
  basePrice: number = 0.0;
  protected readonly masterService: MasterService;
  /**
   * Creates an instance of Item.
   * @param {MasterService} masterService The master service
   * @memberof Item
   */
  constructor(masterService:MasterService){this.masterService=masterService;}
  /**
   * The name of the Item.
   *
   * @readonly
   * @abstract
   * @type {itemname}
   * @memberof Item
   */
  abstract get name(): itemname;
  /**
   * If the Item can be used during a battle.
   *
   * @readonly
   * @abstract
   * @type {boolean}
   * @memberof Item
   */
  abstract get isBattleUsable(): boolean;
  /**
   * If the Item can be used only during a battle
   *
   * @readonly
   * @type {boolean}
   * @memberof Item
   */
  get isMapUsable(): boolean {return true;}
  /**
   * If the Item can be used on the player's party
   *
   * @readonly
   * @abstract
   * @type {boolean}
   * @memberof Item
   */
  abstract get isPartyUsable(): boolean;
  /**
   * If the Item can be used on the enemy's party'
   *
   * @readonly
   * @abstract
   * @type {boolean}
   * @memberof Item
   */
  abstract get isEnemyUsable(): boolean;
  /**
   * If the item can be used on the player
   *
   * @readonly
   * @abstract
   * @type {boolean}
   * @memberof Item
   */
  abstract get isSelfUsable(): boolean;
  /**
   * When the item is disabled.
   *
   * @param {Character} user
   * @return {*}  {boolean}
   * @memberof Item
   */
  disabled(user: Character): boolean { return false;}
  /**
   * If the item is single target.
   *
   * @readonly
   * @abstract
   * @type {boolean}
   * @memberof Item
   */
  abstract get isSingleTarget():boolean;
  /**
   * The action the item perform.
   *
   * @param {Character} user The Character that uses the item.
   * @param {Character} targets The target of the item.
   * @return {*}  {ActionOutput}
   * @memberof Item
   */
  itemEffect(user:Character,targets: Character|Character[]):ActionOutput {
    const description :ActionOutput = [[],[]]
    if(!(targets instanceof Array))targets = [targets]
    this.amount--;
    if(this.amount<=0){ removeItem(user.inventory,this) }
    for(const target of targets)
    {
      pushBattleActionOutput(this._itemEffect(user,target),description);
      pushBattleActionOutput(target.react(this.tags,user),description);
    }
    return  description
  };

  protected abstract _itemEffect(user:Character,target: Character):ActionOutput;
  /**
   * Teh tags associated with the item.
   *
   * @readonly
   * @type {tag[]}
   * @memberof Item
   */
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
  /**
   * Stores the amount of items in the stack.
   *
   * @return {*}  {{[key: string]:any}}
   * @memberof Item
   */
  toJson():ItemStoreable
  {
    return {Factory:"Item",type:this.name,amount:this.amount}
  }
  /**
   * Loads the amount of items in the stack.
   *
   * @param {{[key: string]: any}} options
   * @memberof Item
   */
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
      this._description = [{name:"tags",section_items:this.tags.map(tag =>{return {name:'tag',value:tag}})}]
    return this._description
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
