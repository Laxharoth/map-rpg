import { ItemStoreable } from "../../Items/Item";

export interface Enemy
{
  enemy_type:string;
  get loot():ItemStoreable[];
  base_experience:number;
}
