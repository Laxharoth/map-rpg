import { battleActionOutput } from "src/app/customTypes/customTypes";
import { tag } from "src/app/customTypes/tags";
import { Character } from "../Character/Character";
import { Item } from "../Items/Item";

export abstract class Equipment extends Item
{
  //Check if can equip
  abstract get name():string;
  abstract canEquip(character:Character ):boolean;
  abstract applyModifiers(character:Character):void;
  abstract get tags():tag[];

  get isBattleUsable(): boolean{return true;};
  get isPartyUsable(): boolean {return true;};
  get isEnemyUsable(): boolean {return false;};
  get isSelfUsableOnly(): boolean {return true;};

  itemEffect(user:Character,target: Character): battleActionOutput { return [[],[]] }
}
