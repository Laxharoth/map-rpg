import { MasterService } from "src/app/service/master.service";
import { MasterFlagsSetter } from "src/gameLogic/core/subservice/flag-handler";
import { QuestFactory } from "src/gameLogic/custom/Factory/QuestFactory";
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
import { StoreableType } from "src/gameLogic/core/Factory/Factory";
import { SpecialAttackFactory } from "src/gameLogic/custom/Factory/SpecialAttackFactory";
import { ReactionFactory } from "src/gameLogic/custom/Factory/ReactionFactory";
import { CharacterBattleClassFactory } from "src/gameLogic/custom/Factory/CharacterBattleClassFactory";

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
  "SpecialAttack"="SpecialAttack",
  "Reaction"="Reaction",
  "CharacterBattleClass"="CharacterBattleClass",
}
export type factoryname= `${FactoryName}`;
export type FactoryFunction<T=any,U=StoreableType> = (masterService:MasterService,options:U)=>T;

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
  SpecialAttack:SpecialAttackFactory,
  Reaction:ReactionFactory,
  CharacterBattleClass:CharacterBattleClassFactory,
}
