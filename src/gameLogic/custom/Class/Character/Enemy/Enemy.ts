import { GameItem, ItemStoreable } from "../../Items/Item";
import { Character } from "../Character";

export interface Enemy
{
  get loot():ItemStoreable[];
  base_experience:number;
}
