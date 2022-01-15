import { register_quest } from "../Class/Quest/QuestFactory";

export async function load_files({})
{
  //@ts-ignore
  await import("../../../assets/Quest/DefeatEnemyQuest.js").then(module=>register_quest(module))

}
