import { MasterService } from "src/app/service/master.service";
import { Factory, StoreableType } from "src/gameLogic/core/Factory/Factory";
import { MasterFlagsSetter } from "src/gameLogic/core/subservice/flag-handler";
import { escapeBattle } from 'src/gameLogic/custom/Class/Battle/Battle.functions';
import { enterRoomOption, nextOption } from 'src/gameLogic/custom/Class/Scene/CommonOptions';
import { ShopFactory } from "src/gameLogic/custom/Class/Shop/DynamicShop";
import { UpgradeFactory } from "src/gameLogic/custom/Class/Upgrade/UpgradeFactory";
import { CharacterBattleClassFactory } from "src/gameLogic/custom/Factory/CharacterBattleClassFactory";
import { CharacterFactory } from "src/gameLogic/custom/Factory/CharacterFactory";
import { EnemyFormationFactory } from "src/gameLogic/custom/Factory/EnemyFormationFactory";
import { ItemFactory } from "src/gameLogic/custom/Factory/ItemFactory";
import { PerkFactory } from "src/gameLogic/custom/Factory/PerkFactory";
import { QuestFactory } from "src/gameLogic/custom/Factory/QuestFactory";
import { ReactionFactory } from "src/gameLogic/custom/Factory/ReactionFactory";
import { SpecialAttackFactory } from "src/gameLogic/custom/Factory/SpecialAttackFactory";
import { StatusFactory } from "src/gameLogic/custom/Factory/StatusFactory";
import { pushBattleActionOutput, randomBetween, randomCheck } from 'src/gameLogic/custom/functions/htmlHelper.functions';
import { SetDataweb } from "src/gameLogic/custom/subservice/fact-web";
import { enterRoom } from 'src/gameLogic/custom/subservice/map-handler';
import { SetCurrentParty } from "src/gameLogic/custom/subservice/party";
import { loadQuest } from "src/gameLogic/custom/subservice/quest-holder";
import { SetTimeHandler } from "src/gameLogic/custom/subservice/time-handler";
import { BattleFactory } from './../../custom/Factory/BattleFactory';


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
  "Battle"="Battle",
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
  // @ts-ignore
  Battle:BattleFactory,
}

const factoryOptions = {
  nextOption,
  enterRoomOption,
};
export interface ModuleFunctions{
  randomCheck:typeof randomCheck;
  randomBetween:typeof randomBetween;
  pushBattleActionOutput:typeof pushBattleActionOutput;
  options:typeof factoryOptions;
  escapeBattle:typeof escapeBattle;
  enterRoom:typeof enterRoom;
}
(Factory as unknown as ModuleFunctions).randomCheck=randomCheck;
(Factory as unknown as ModuleFunctions).randomBetween=randomBetween;
(Factory as unknown as ModuleFunctions).pushBattleActionOutput=pushBattleActionOutput;
(Factory as unknown as ModuleFunctions).escapeBattle=escapeBattle;
(Factory as unknown as ModuleFunctions).enterRoom=enterRoom;
(Factory as unknown as ModuleFunctions).options = factoryOptions;
