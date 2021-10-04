import { ActionOutput, storeable } from "src/app/customTypes/customTypes";
import { itemname } from "src/app/customTypes/itemnames";
import { tag } from "src/app/customTypes/tags";
import { Character } from "../Character/Character";
import { MasterService } from "src/app/service/master.service";

/**
 * Model of game items.
 *
 * @export
 * @abstract
 * @class Item
 * @implements {storeable}
 * @constructor Initializes the masterService
 */
export abstract class Item implements storeable
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
  /**
   * Stores the amount of items in the stack.
   *
   * @return {*}  {{[key: string]:any}}
   * @memberof Item
   */
  toJson():{[key: string]:any}
  {
    return {amount:this.amount}
  }
  /**
   * Loads the amount of items in the stack.
   *
   * @param {{[key: string]: any}} options
   * @memberof Item
   */
  fromJson(options: {[key: string]: any}): void
  {
    const {amount,basePrice} = options;
    amount&&(this.amount = amount);
    basePrice&&(this.basePrice = basePrice);
  }
}
