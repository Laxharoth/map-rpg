import { MasterService } from "src/app/service/master.service";
import { factoryname } from "src/gameLogic/configurable/Factory/FactoryMap";
import { storeable } from "src/gameLogic/core/Factory/Factory";
import { ActionOutput, Character } from 'src/gameLogic/custom/Class/Character/Character';
import { itemname } from "src/gameLogic/custom/Class/Items/Item.type";
import { tag } from "src/gameLogic/custom/customTypes/tags";

/**
 * Model of game items.
 *
 * @export
 * @abstract
 * @class Item
 * @implements {storeable}
 * @constructor Initializes the masterService
 */
export abstract class GameItem implements storeable
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
  get isBattleUsableOnly(): boolean {return false;}
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
   * @param {Character} target The target of the item.
   * @return {*}  {ActionOutput}
   * @memberof Item
   */
  itemEffect(user:Character,target: Character):ActionOutput { return target.react(this.tags,user) };
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
    const {amount,basePrice} = options;
    amount&&(this.amount = amount);
    basePrice&&(this.basePrice = basePrice);
  }
  get description(): string
  {
    if(this.tags.length === 0) return '';
    return `tags:\n\t ${this.tags.join(', ')}`;
  }
}
export type ItemStoreable ={
  Factory:factoryname;
  type:itemname;
  amount:number;
  basePrice?:number;
}