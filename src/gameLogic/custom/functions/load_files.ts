import { register_quest } from "../Class/Quest/QuestFactory";
import { register_item } from "../Factory/ItemFactory";

export async function load_files({})
{
  //@ts-ignore
  await import("../../../assets/Load/Quest/DefeatEnemyQuest.js").then(module=>register_quest(module))
  //@ts-ignore
  await import("../../../assets/Load/Item/Item/PoisonPill.js").then(module=>register_item(module))
}
