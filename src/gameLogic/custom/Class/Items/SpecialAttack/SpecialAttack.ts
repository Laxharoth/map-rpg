import { Character } from "src/gameLogic/custom/Class/Character/Character";
import { GameItem } from "src/gameLogic/custom/Class/Items/Item";
import { specialsname } from "src/gameLogic/custom/Class/Items/Item.type";

export abstract class SpecialAttack extends GameItem
{
  cooldown: number = 0;
  abstract get name():specialsname;
  disabled(user:Character): boolean { return this.cooldown > 0;}

  get isBattleUsable(): boolean { return true; }
  get isBattleUsableOnly(): boolean { return true; }
}
