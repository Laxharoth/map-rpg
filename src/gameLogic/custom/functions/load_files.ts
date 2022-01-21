import { add_module, register_all_modules } from "src/gameLogic/core/Factory/Register_Module/RegisterModule";

export async function load_files({})
{
  //@ts-ignore
  await import("../../../Load/Quest/DefeatEnemyQuest.ts").then(module=>add_module(module))
  //@ts-ignore
  await import("../../../Load/Item/Item/PoisonPill.ts").then(module=>add_module(module))
  //@ts-ignore
  await import("../../../Load/Status/StatusBlind.ts").then(module=>add_module(module))
  //@ts-ignore
  await import("../../../Load/Status/StatusCharm.ts").then(module=>add_module(module))
  //@ts-ignore
  await import("../../../Load/Status/StatusInvisible.ts").then(module=>add_module(module))
  //@ts-ignore
  await import("../../../Load/Status/StatusPetrified.ts").then(module=>add_module(module))
  //@ts-ignore
  await import("../../../Load/Status/StatusProne.ts").then(module=>add_module(module))
  //@ts-ignore
  await import("../../../Load/Status/StatusRestrained.ts").then(module=>add_module(module))
  //@ts-ignore
  await import("../../../Load/Status/StatusSleep.ts").then(module=>add_module(module))
  //@ts-ignore
  await import("../../../Load/Status/StatusPoison.ts").then(module=>add_module(module))
  //@ts-ignore
  await import("../../../Load/Status/StatusGrappled.ts").then(module=>add_module(module))
  //@ts-ignore
  await import("../../../Load/Status/StatusFright.ts").then(module=>add_module(module))
  //@ts-ignore
  await import("../../../Load/Status/PoisonRush.ts").then(module=>add_module(module))
  //@ts-ignore
  await import("../../../Load/Item/Equipment/ShieldGuard.ts").then(module=>add_module(module))
  //@ts-ignore
  await import("../../../Load/Item/Equipment/ItemTest.ts").then(module=>add_module(module))
  //@ts-ignore
  await import("../../../Load/Perk/PerkUpgradeable.ts").then(module=>add_module(module))
  register_all_modules()
}
