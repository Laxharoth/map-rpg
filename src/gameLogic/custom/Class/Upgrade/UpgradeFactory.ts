import { MasterService } from "src/app/service/master.service";
import { FactoryFunction } from "src/gameLogic/configurable/Factory/FactoryMap";
import { StoreableType } from "src/gameLogic/core/Factory/Factory";
import { Upgrade } from "./Upgrade";
import { UpgradeOptions, upgrade_name } from "./Upgrade.type";
import { UpgradeCharm } from "./Upgrades/UpgradeCharm";
import { UpgradeFright } from "./Upgrades/UpgradeFright";
import { UpgradeGrappler } from "./Upgrades/UpgradeGrappler";
import { UpgradePoisonRush } from "./Upgrades/UpgradePoisonRush";

export const UpgradeFactory = (()=>{
  const upgrades:{[key: string]:Upgrade} = {};
  return (masterService:MasterService,{type}:UpgradeOptions)=>
  {
    if(!upgrades[type])upgrades[type] = upgrade_switcer[type](masterService);
    return upgrades[type]
  }
})()

const upgrade_switcer:{[key in upgrade_name]:(masterService:MasterService)=>Upgrade} = {
  'Charm':(masterService:MasterService)=>new UpgradeCharm(masterService),
  'Fright':(masterService:MasterService)=>new UpgradeFright(masterService),
  'Grappler':(masterService:MasterService)=>new UpgradeGrappler(masterService),
  'Poison Rush':(masterService:MasterService)=>new UpgradePoisonRush(masterService),
}