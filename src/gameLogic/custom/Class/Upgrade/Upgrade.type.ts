import { factoryname } from "src/gameLogic/configurable/Factory/FactoryMap"

enum upgrade_name_enum {
  Charm='Charm',
  Fright='Fright',
  Grappler='Grappler',
  "Poison Rush"='Poison Rush',
}

export type upgrade_name = `${upgrade_name_enum}`

export type UpgradeOptions = {
  Factory:factoryname,
  type:upgrade_name
}
