import { factoryname } from "src/gameLogic/configurable/Factory/FactoryMap"

enum upgradeNameEnum {
  Charm='Charm',
  Fright='Fright',
  Grappler='Grappler',
  "Poison Rush"='Poison Rush',
}

export type upgradeName = `${upgradeNameEnum}`

export type UpgradeOptions = {
  Factory:factoryname,
  type:upgradeName
}
