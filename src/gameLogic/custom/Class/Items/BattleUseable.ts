import { tag } from "../../customTypes/tags";
import { Character } from "../Character/Character";
import { ActionOutput } from "../Character/Character.type";
import { Descriptable, GameElementDescriptionSection } from "../GameElementDescription/GameElementDescription";

export interface BattleUseable extends Descriptable
{
  /** The name of the Item. */
  readonly name: string;
  /** If the Item can be used during a battle. */
  get isBattleUsable(): boolean;
  /** If the Item can be used only during a battle */
  get isMapUsable(): boolean;
  /** If the Item can be used on the player's party */
  get isPartyUsable(): boolean;
  /** If the Item can be used on the enemy's party' */
  get isEnemyUsable(): boolean;
  /** If the item can be used on the player */
  get isSelfUsable(): boolean;
  /** When the item is disabled. */
  disabled(user: Character): boolean;
  /** If the item is single target. */
  get isSingleTarget():boolean;
  /** The action the item perform. */
  itemEffect(user:Character,targets: Character|Character[]):ActionOutput;
  get description(): GameElementDescriptionSection[];
  get tags(): tag[];
}
