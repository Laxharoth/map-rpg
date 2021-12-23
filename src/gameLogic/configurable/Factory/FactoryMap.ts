import { MasterService } from "src/app/service/master.service";
import { MasterFlagsSetter } from "src/gameLogic/core/subservice/flag-handler";
import { ShopFactory } from "src/gameLogic/custom/Class/Shop/DynamicShop";
import { CharacterFactory } from "src/gameLogic/custom/Factory/CharacterFactory";
import { ItemFactory } from "src/gameLogic/custom/Factory/ItemFactory";
import { PerkFactory } from "src/gameLogic/custom/Factory/PerkFactory";
import { StatusFactory } from "src/gameLogic/custom/Factory/StatusFactory";
import { SetDataweb } from "src/gameLogic/custom/subservice/fact-web";
import { SetCurrentParty } from "src/gameLogic/custom/subservice/party";

export enum FactoryName{
  'Item'='Item',
  'Character'='Character',
  'Perk'='Perk',
  'Status'='Status',
  "Flags"='Flags',
  "Shop"='Shop',
  "CurrentParty"="CurrentParty",
  "FactWeb"="FactWeb",
  "TimeHandler"="TimeHandler",
}
export type factoryname= `${FactoryName}`;
export type FactoryFunction = (masterService:MasterService,options:{[key: string]: any})=>any;

export const factoryMap:{[key in FactoryName]:FactoryFunction} = {
  Item: ItemFactory,
  Character: CharacterFactory,
  Perk: PerkFactory,
  Status: StatusFactory,
  Flags: MasterFlagsSetter,
  Shop: ShopFactory,
  CurrentParty: SetCurrentParty,
  FactWeb: SetDataweb,
  TimeHandler: SetDataweb,
}
