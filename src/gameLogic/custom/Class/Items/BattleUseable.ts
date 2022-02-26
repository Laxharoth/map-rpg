import { tag } from "../../customTypes/tags";
import { Character } from "../Character/Character";
import { ActionOutput } from "../Character/Character.type";
import { itemname } from "./Item.type";
import { descriptable, GameElementDescriptionSection } from "../GameElementDescription/GameElementDescription";

export interface BattleUseable extends descriptable
{
  /**
   * The name of the Item.
   *
   * @readonly
   * @type {itemname}
   * @memberof Item
   */
  readonly name: string;
  /**
   * If the Item can be used during a battle.
   *
   * @readonly
   * @type {boolean}
   * @memberof Item
   */
  get isBattleUsable(): boolean;
  /**
   * If the Item can be used only during a battle
   *
   * @readonly
   * @type {boolean}
   * @memberof Item
   */
  get isMapUsable(): boolean;
  /**
   * If the Item can be used on the player's party
   *
   * @readonly
   * @type {boolean}
   * @memberof Item
   */
  get isPartyUsable(): boolean;
  /**
   * If the Item can be used on the enemy's party'
   *
   * @readonly
   * @type {boolean}
   * @memberof Item
   */
  get isEnemyUsable(): boolean;
  /**
   * If the item can be used on the player
   *
   * @readonly
   * @type {boolean}
   * @memberof Item
   */
  get isSelfUsable(): boolean;
  /**
   * When the item is disabled.
   *
   * @param {Character} user
   * @return { boolean }
   * @memberof Item
   */
  disabled(user: Character): boolean;
  /**
   * If the item is single target.
   *
   * @readonly
   * @type {boolean}
   * @memberof Item
   */
  get isSingleTarget():boolean;
  /**
   * The action the item perform.
   *
   * @param {Character} user The Character that uses the item.
   * @param {Character} targets The target of the item.
   * @return { ActionOutput }
   * @memberof Item
   */
  itemEffect(user:Character,targets: Character|Character[]):ActionOutput;
  get description(): GameElementDescriptionSection[];
  get tags(): tag[];
}
