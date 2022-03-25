import { add_module, register_all_modules } from "src/gameLogic/core/Factory/Register_Module/RegisterModule";

export async function load_files({})
{
  await import("../../../Load/Quest/DefeatEnemyQuest").then(module=>add_module(module))
  await import("../../../Load/Item/Item/PoisonPill").then(module=>add_module(module))
  await import("../../../Load/Status/StatusBlind").then(module=>add_module(module))
  await import("../../../Load/Status/StatusCharm").then(module=>add_module(module))
  await import("../../../Load/Status/StatusInvisible").then(module=>add_module(module))
  await import("../../../Load/Status/StatusPetrified").then(module=>add_module(module))
  await import("../../../Load/Status/StatusProne").then(module=>add_module(module))
  await import("../../../Load/Status/StatusRestrained").then(module=>add_module(module))
  await import("../../../Load/Status/StatusSleep").then(module=>add_module(module))
  await import("../../../Load/Status/StatusPoison").then(module=>add_module(module))
  await import("../../../Load/Status/StatusGrappled").then(module=>add_module(module))
  await import("../../../Load/Status/StatusFright").then(module=>add_module(module))
  await import("../../../Load/Status/PoisonRush").then(module=>add_module(module))
  await import("../../../Load/Item/Equipment/ItemTest").then(module=>add_module(module))
  await import("../../../Load/Item/Equipment/ShieldGuard").then(module=>add_module(module))
  await import("../../../Load/Perk/PerkUpgradeable").then(module=>add_module(module))
  await import("../../../Load/Character/TestCharacter").then(module=>add_module(module));
  await import("../../../Load/Map/TestMap/TestMaps").then(module=>add_module(module));
  register_all_modules()
}
