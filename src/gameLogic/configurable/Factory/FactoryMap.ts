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
import { EnemyFormationFactory } from "src/gameLogic/custom/Factory/EnemyFormationFactory";

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
  "EnemyFormation"="EnemyFormation",
}
export type factoryname= `${FactoryName}`;
export type FactoryFunction<T=any,U=StoreableType> = (masterService:MasterService,options:U)=>T;

export const factoryMap:{[key in FactoryName]:FactoryFunction} = {
  // @ts-ignore
  Item: ItemFactory,
  // @ts-ignore
  Character: CharacterFactory,
  // @ts-ignore
  Perk: PerkFactory,
  // @ts-ignore
  Status: StatusFactory,
  // @ts-ignore
  Flags: MasterFlagsSetter,
  // @ts-ignore
  Shop: ShopFactory,
  // @ts-ignore
  CurrentParty: SetCurrentParty,
  // @ts-ignore
  FactWeb: SetDataweb,
  // @ts-ignore
  TimeHandler: SetTimeHandler,
  // @ts-ignore
  Upgrade:UpgradeFactory,
  // @ts-ignore
  Quest:QuestFactory,
  // @ts-ignore
  load_quests:loadQuest,
  // @ts-ignore
  SpecialAttack:SpecialAttackFactory,
  // @ts-ignore
  Reaction:ReactionFactory,
  // @ts-ignore
  CharacterBattleClass:CharacterBattleClassFactory,
  // @ts-ignore
  EnemyFormation:EnemyFormationFactory,
}
