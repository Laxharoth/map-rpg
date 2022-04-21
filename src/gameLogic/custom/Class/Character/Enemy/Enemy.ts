import { ItemStoreable } from "../../Items/Item";

export interface Enemy{
  enemyType:string;
  get loot():ItemStoreable[];
  baseExperience:number;
}
