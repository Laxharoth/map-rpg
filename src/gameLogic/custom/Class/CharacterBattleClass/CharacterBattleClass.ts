import { MasterService } from "src/app/service/master.service";
import { storeable } from "src/gameLogic/core/Factory/Factory";
import { CalculatedStats, CoreStats, FullCalculatedStats, FullCoreStats, FullResistanceStats, LevelStats, ResistanceStats } from "src/gameLogic/custom/Class/Character/Character.type";
import { Int, roundToInt } from "../../ClassHelper/Int";
import { Upgrade } from "../Upgrade/Upgrade";
import { UpgradeOptions } from "../Upgrade/Upgrade.type";
import { UpgradeFactory } from "../Upgrade/UpgradeFactory";
import { ArrayTree, tree_node } from "./ArrayTree";

export abstract class CharacterBattleClass implements storeable{
  abstract readonly type: string;
  abstract name: string;
  protected abstract _initial_physic_stats: CoreStats;
  protected abstract _upgrade_tree:ArrayTree<Upgrade>|tree_node<UpgradeOptions>[];
  abstract experience_cap:experience_cap;
  level_up_upgrade_point:experience_cap=[5,5,5,5,5];
  level_up_perk_point:experience_cap=[1,1,1,1,1];
  protected _initial_resistance_stats: ResistanceStats = {
    heatresistance: 0,
    energyresistance: 0,
    frostresistance: 0,
    slashresistance: 0,
    bluntresistance: 0,
    pierceresistance: 0,
    poisonresistance: 0,
  };
  max_core_stats: FullCoreStats[] = [1, 2, 3, 4, 5].map(level => {
    return {
      aim: roundToInt(level * 10),
      intelligence: roundToInt(level * 10),
      speed: roundToInt(level * 10),
      stamina: roundToInt(level * 10),
      strenght: roundToInt(level * 10),
    }
  })
  constructor() {}
  get initial_physic_stats():FullCoreStats{
    return {
      strenght     : (this._initial_physic_stats.strenght || 0) as Int,
      stamina      : (this._initial_physic_stats.stamina || 0) as Int,
      intelligence : (this._initial_physic_stats.intelligence || 0) as Int,
      aim          : (this._initial_physic_stats.aim || 0) as Int,
      speed        : (this._initial_physic_stats.speed || 0) as Int,
    };
  }
  get initial_resistance_stats():FullResistanceStats{
    return {
      heatresistance: roundToInt(this._initial_resistance_stats.heatresistance||0),
      energyresistance: roundToInt(this._initial_resistance_stats.energyresistance||0),
      frostresistance: roundToInt(this._initial_resistance_stats.frostresistance||0),
      slashresistance: roundToInt(this._initial_resistance_stats.slashresistance||0),
      bluntresistance: roundToInt(this._initial_resistance_stats.bluntresistance||0),
      pierceresistance: roundToInt(this._initial_resistance_stats.pierceresistance||0),
      poisonresistance: roundToInt(this._initial_resistance_stats.poisonresistance||0),
    }
  }
  upgrade_tree(masterService: MasterService):ArrayTree<Upgrade>{
    if(!(this._upgrade_tree instanceof ArrayTree)){
      // @ts-ignore
      const virtual_root_node:tree_node<Upgrade> = {value:null, children:this.initialize_upgrades(masterService)}
      this._upgrade_tree = new ArrayTree(virtual_root_node)
    }
    return this._upgrade_tree;
  }
  total_experience_to_next_level(level:number):number { return this.experience_cap[level]||0; }
  current_level_experience(level_stats:LevelStats):number { return level_stats.experience - this.total_experience_to_next_level(level_stats.level-1) }
  max_core_at_level(level:number):FullCoreStats{return this.max_core_stats[level]}
  protected _calculate_stats({ strenght, stamina, aim, speed, intelligence, }: FullCoreStats): CalculatedStats {
    return {
      hitpoints:1,
      energypoints:1,
      physical_attack: 0,
      ranged_attack: 0,
      physical_defence: 0,
      ranged_defence: 0,
      accuracy: 0,
      evasion: 0,
      initiative: 0,
    }
  }
  calculate_stats(core_stats: FullCoreStats): FullCalculatedStats {
    const { hitpoints = null    , energypoints = null     , physical_attack = null,
            ranged_attack = null, physical_defence = null , ranged_defence = null,
            accuracy = null     , evasion = null          , initiative = null     }= this._calculate_stats(core_stats);
    return {
      hitpoints: roundToInt(hitpoints||0),
      energypoints: roundToInt(energypoints||0),
      physical_attack: roundToInt(physical_attack||0),
      ranged_attack: roundToInt(ranged_attack||0),
      physical_defence: roundToInt(physical_defence||0),
      ranged_defence: roundToInt(ranged_defence||0),
      accuracy: roundToInt(accuracy||0),
      evasion: roundToInt(evasion||0),
      initiative: roundToInt(initiative||0),
    }
  }
  private initialize_upgrades(masterService: MasterService):tree_node<Upgrade>[]{
    if(this._upgrade_tree instanceof ArrayTree)return [this._upgrade_tree.root];
    return fill_root(this._upgrade_tree);
    function fill_root(root: tree_node < UpgradeOptions > []) {
      const upgrade_tree_nodes: tree_node < Upgrade > [] = []
      for (const upgrade_option_node of root) {
        upgrade_tree_nodes.push({
          value: UpgradeFactory(masterService, upgrade_option_node.value),
          children: fill_root(upgrade_option_node.children)
        })
      }
      return upgrade_tree_nodes;
    }
  }
  toJson(): BattleClassOptions {
    return {
      Factory:"CharacterBattleClass",
      type:this.name
    }
  }
  fromJson(options: BattleClassOptions): void {}
}
export class CharacterBattleClassEmpty extends CharacterBattleClass {
  type:"CharacterBattleClassEmpty"="CharacterBattleClassEmpty"
  name: string="CharacterBattleClassEmpty";
  _initial_physic_stats: CoreStats={aim:1,intelligence:1,speed:1,stamina:1,strenght:1};
  protected _upgrade_tree: ArrayTree<Upgrade> | tree_node<UpgradeOptions>[]=[];
  experience_cap: experience_cap=[1,1,1,1,1];
}
export type BattleClassOptions={
  Factory:"CharacterBattleClass",
  type:string,
  [key:string]:any
}
export type experience_cap = [number, number, number, number, number];
