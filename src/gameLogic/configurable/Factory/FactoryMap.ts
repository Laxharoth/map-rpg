import { MasterService } from "src/app/service/master.service";
import { MasterFlagsSetter } from "src/gameLogic/core/subservice/flag-handler";
import { QuestFactory } from "src/gameLogic/custom/Class/Quest/QuestFactory";
import { ShopFactory } from "src/gameLogic/custom/Class/Shop/DynamicShop";
import { UpgradeFactory } from "src/gameLogic/custom/Class/Upgrade/UpgradeFactory";
import { CharacterFactory } from "src/gameLogic/custom/Factory/CharacterFactory";
import { ItemFactory } from "src/gameLogic/custom/Factory/ItemFactory";
import { PerkFactory } from "src/gameLogic/custom/Factory/PerkFactory";
import { StatusFactory } from "src/gameLogic/custom/Factory/StatusFactory";
import { SetDataweb } from "src/gameLogic/custom/subservice/fact-web";
import { SetCurrentParty } from "src/gameLogic/custom/subservice/party";
import { loadQuest } from "src/gameLogic/custom/subservice/quest-holder";
import { SetTimeHandler } from "src/gameLogic/custom/subservice/time-handler";

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
  "Upgrade"="Upgrade",
  "Quest"="Quest",
  "load_quests"="load_quests",
}
export type factoryname= `${FactoryName}`;
export type FactoryFunction<T=any> = (masterService:MasterService,options:{[key: string]: any})=>T;

export const factoryMap:{[key in FactoryName]:FactoryFunction} = {
  Item: ItemFactory,
  Character: CharacterFactory,
  Perk: PerkFactory,
  Status: StatusFactory,
  Flags: MasterFlagsSetter,
  Shop: ShopFactory,
  CurrentParty: SetCurrentParty,
  FactWeb: SetDataweb,
  TimeHandler: SetTimeHandler,
  Upgrade:UpgradeFactory,
  Quest:QuestFactory,
  load_quests:loadQuest,
}
