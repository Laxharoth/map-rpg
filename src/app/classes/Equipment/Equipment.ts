import { ActionOutput, characterStats } from "src/app/customTypes/customTypes";
import { tag } from "src/app/customTypes/tags";
import { Character } from "../Character/Character";
import { Reaction } from "../Character/Reaction/Reaction";
import { Item } from "../Items/Item";
import { SpecialAttack } from "../Items/SpecialAttack/SpecialAttack";

export abstract class Equipment extends Item
{
  //Check if can equip
  abstract get name():string;
  abstract canEquip(character:Character ):boolean;
  abstract get tags():tag[];
  protected readonly abstract statsModifier:characterStats;
  
  get reactions(): Reaction[]{return []};
  get specials():SpecialAttack[]{return []};
  
  get isBattleUsable(): boolean{return true;};
  get isPartyUsable(): boolean {return true;};
  get isEnemyUsable(): boolean {return false;};
  get isSelfUsableOnly(): boolean {return true;};
  
  itemEffect(user:Character,target: Character): ActionOutput { return [[],[]] }
  applyModifiers(character:Character):void
  {
    for(const key of Object.keys(this.statsModifier))
    { character.stats[key] = this.statsModifier[key]}
  }
}
