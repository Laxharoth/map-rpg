import { MasterService } from "src/app/service/master.service";
import { Storeable } from "src/gameLogic/core/Factory/Factory";
import { CalculatedStats, CoreStats, FullCalculatedStats,
         FullCoreStats, FullResistanceStats,
         LevelStats, ResistanceStats } from "src/gameLogic/custom/Class/Character/Character.type";
import { Int, roundToInt } from "../../ClassHelper/Int";
import { Upgrade } from "../Upgrade/Upgrade";
import { UpgradeOptions } from "../Upgrade/Upgrade.type";
import { UpgradeFactory } from "../Upgrade/UpgradeFactory";
import { ArrayTree, tree_node } from "./ArrayTree";

export abstract class CharacterBattleClass implements Storeable{
  abstract readonly type: string;
  abstract name: string;
  protected abstract _initialPhysicStats: CoreStats;
  protected abstract _upgradeTree:ArrayTree<Upgrade>|tree_node<UpgradeOptions>[];
  abstract experienceCap:experience_cap;
  levelUpUpgradePoint:experience_cap=[5,5,5,5,5];
  levelUpPerkPoint:experience_cap=[1,1,1,1,1];
  protected _initialResistanceStats: ResistanceStats = {
    heatresistance: 0,
    energyresistance: 0,
    frostresistance: 0,
    slashresistance: 0,
    bluntresistance: 0,
    pierceresistance: 0,
    poisonresistance: 0,
  };
  maxCoreStats: FullCoreStats[] = [1, 2, 3, 4, 5].map(level => {
    return {
      aim: roundToInt(level * 10),
      intelligence: roundToInt(level * 10),
      speed: roundToInt(level * 10),
      stamina: roundToInt(level * 10),
      strenght: roundToInt(level * 10),
    }
  })
  get initialPhysicStats():FullCoreStats{
    return {
      strenght     : (this._initialPhysicStats.strenght || 0) as Int,
      stamina      : (this._initialPhysicStats.stamina || 0) as Int,
      intelligence : (this._initialPhysicStats.intelligence || 0) as Int,
      aim          : (this._initialPhysicStats.aim || 0) as Int,
      speed        : (this._initialPhysicStats.speed || 0) as Int,
    };
  }
  get initialResistanceStats():FullResistanceStats{
    return {
      heatresistance: roundToInt(this._initialResistanceStats.heatresistance||0),
      energyresistance: roundToInt(this._initialResistanceStats.energyresistance||0),
      frostresistance: roundToInt(this._initialResistanceStats.frostresistance||0),
      slashresistance: roundToInt(this._initialResistanceStats.slashresistance||0),
      bluntresistance: roundToInt(this._initialResistanceStats.bluntresistance||0),
      pierceresistance: roundToInt(this._initialResistanceStats.pierceresistance||0),
      poisonresistance: roundToInt(this._initialResistanceStats.poisonresistance||0),
    }
  }
  upgradeTree(masterService: MasterService):ArrayTree<Upgrade>{
    if(!(this._upgradeTree instanceof ArrayTree)){
      // @ts-ignore
      const virtualRootNode:tree_node<Upgrade> = {value:null, children:this.initializeUpgrades(masterService)}
      this._upgradeTree = new ArrayTree(virtualRootNode)
    }
    return this._upgradeTree;
  }
  totalExperienceToNextLevel(level:number):number { return this.experienceCap[level]||0; }
  currentLevelExperience(levelStats:LevelStats):number {
    return levelStats.experience - this.totalExperienceToNextLevel(levelStats.level-1)
  }
  maxCoreAtLevel(level:number):FullCoreStats{return this.maxCoreStats[level]}
  protected _calculateStats({ strenght, stamina, aim, speed, intelligence, }: FullCoreStats): CalculatedStats {
    return {
      hitpoints:1,
      energypoints:1,
      physicalAttack: 0,
      rangedAttack: 0,
      physicalDefence: 0,
      rangedDefence: 0,
      accuracy: 0,
      evasion: 0,
      initiative: 0,
    }
  }
  calculate_stats(coreStats: FullCoreStats): FullCalculatedStats {
    const { hitpoints = null    , energypoints = null     , physicalAttack = null,
            rangedAttack = null, physicalDefence = null , rangedDefence = null,
            accuracy = null     , evasion = null          , initiative = null     }= this._calculateStats(coreStats);
    return {
      hitpoints: roundToInt(hitpoints||0),
      energypoints: roundToInt(energypoints||0),
      physicalAttack: roundToInt(physicalAttack||0),
      rangedAttack: roundToInt(rangedAttack||0),
      physicalDefence: roundToInt(physicalDefence||0),
      rangedDefence: roundToInt(rangedDefence||0),
      accuracy: roundToInt(accuracy||0),
      evasion: roundToInt(evasion||0),
      initiative: roundToInt(initiative||0),
    }
  }
  private initializeUpgrades(masterService: MasterService):tree_node<Upgrade>[]{
    if(this._upgradeTree instanceof ArrayTree)return [this._upgradeTree.root];
    return fillRoot(this._upgradeTree);
    function fillRoot(root: tree_node < UpgradeOptions > []) {
      const upgradeTreeNodes: tree_node < Upgrade > [] = []
      for (const upgradeOptionNode of root) {
        upgradeTreeNodes.push({
          value: UpgradeFactory(masterService, upgradeOptionNode.value),
          children: fillRoot(upgradeOptionNode.children)
        })
      }
      return upgradeTreeNodes;
    }
  }
  toJson(): BattleClassOptions {
    return {
      Factory:"CharacterBattleClass",
      type:this.name
    }
  }
  fromJson(options: BattleClassOptions): void { return undefined; }
}
// tslint:disable-next-line: max-classes-per-file
export class CharacterBattleClassEmpty extends CharacterBattleClass {
  type:"CharacterBattleClassEmpty"="CharacterBattleClassEmpty"
  name: string="CharacterBattleClassEmpty";
  _initialPhysicStats: CoreStats={aim:1,intelligence:1,speed:1,stamina:1,strenght:1};
  protected _upgradeTree: ArrayTree<Upgrade> | tree_node<UpgradeOptions>[]=[];
  experienceCap: experience_cap=[1,1,1,1,1];
}
export type BattleClassOptions={
  Factory:"CharacterBattleClass",
  type:string,
  [key:string]:any
}
export type experience_cap = [number, number, number, number, number];
