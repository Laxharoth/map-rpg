import { addModule, registerable, registerAllModules } from "src/gameLogic/core/Factory/Register_Module/RegisterModule";

export async function load_files({})
{
  await import("../../../Load/Quest/DefeatEnemyQuest").then(module=>addModule(module as unknown as registerable));
  await import("../../../Load/Item/Item/PoisonPill").then(module=>addModule(module as unknown as registerable));
  await import("../../../Load/Status/StatusBlind").then(module=>addModule(module as unknown as registerable));
  await import("../../../Load/Status/StatusCharm").then(module=>addModule(module as unknown as registerable));
  await import("../../../Load/Status/StatusInvisible").then(module=>addModule(module as unknown as registerable));
  await import("../../../Load/Status/StatusPetrified").then(module=>addModule(module as unknown as registerable));
  await import("../../../Load/Status/StatusProne").then(module=>addModule(module as unknown as registerable));
  await import("../../../Load/Status/StatusRestrained").then(module=>addModule(module as unknown as registerable));
  await import("../../../Load/Status/StatusSleep").then(module=>addModule(module as unknown as registerable));
  await import("../../../Load/Status/StatusPoison").then(module=>addModule(module as unknown as registerable));
  await import("../../../Load/Status/StatusGrappled").then(module=>addModule(module as unknown as registerable));
  await import("../../../Load/Status/StatusFright").then(module=>addModule(module as unknown as registerable));
  await import("../../../Load/Status/PoisonRush").then(module=>addModule(module as unknown as registerable));
  await import("../../../Load/Item/Equipment/ItemTest").then(module=>addModule(module as unknown as registerable));
  await import("../../../Load/Item/Equipment/ShieldGuard").then(module=>addModule(module as unknown as registerable));
  await import("../../../Load/Perk/PerkUpgradeable").then(module=>addModule(module as unknown as registerable));
  await import("../../../Load/Character/TestCharacter").then(module=>addModule(module as unknown as registerable));
  await import("../../../Load/Map/TestMap/TestMaps").then(module=>addModule(module as unknown as registerable));
  /* ------------------------ */
  await import("../../../Load/small-campaign-test/maps/maps").then(module=>addModule(module as unknown as registerable));
  await import("../../../Load/small-campaign-test/battleClass").then(module=>addModule(module as unknown as registerable));
  await import("../../../Load/small-campaign-test/items").then(module=>addModule(module as unknown as registerable));
  await import("../../../Load/small-campaign-test/quest").then(module=>addModule(module as unknown as registerable));
  await import("../../../Load/small-campaign-test/reactions").then(module=>addModule(module as unknown as registerable));
  await import("../../../Load/small-campaign-test/specialAttack").then(module=>addModule(module as unknown as registerable));
  await import("../../../Load/small-campaign-test/status").then(module=>addModule(module as unknown as registerable));
  registerAllModules()
}
