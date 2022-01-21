import { EnergyStats, FullCalculatedStats, FullCoreStats, ResistanceStats } from '../Character/Character.type';
import { Upgrade } from '../Upgrade/Upgrade';
import { UpgradeOptions } from '../Upgrade/Upgrade.type';
import { ArrayTree, tree_node } from './ArrayTree';
import { CharacterBattleClass, experience_cap } from './CharacterBattleClass';

export class TestMainCharacterBattleClass extends CharacterBattleClass
{
  name: string="TestMainCharacterBattleClass";
  initial_core_stats: EnergyStats = {
    hitpoints:150,
    energypoints:150,
  };
  initial_physic_stats: FullCoreStats = {
    strenght:25,
    stamina:25,
    aim:25,
    speed:25,
    intelligence:25,
  };
  initial_resistance_stats: ResistanceStats = {
    heatresistance:10,
    energyresistance:10,
    frostresistance:10,
    slashresistance:10,
    bluntresistance:10,
    pierceresistance:10,
    poisonresistance:10,
  };
  experience_cap:experience_cap = [ 100,1000,2000,5000,10000 ]
  calculate_stats({strenght, stamina, aim, speed, intelligence,}:FullCoreStats):FullCalculatedStats {
    return {
      physical_attack:Math.round(strenght+stamina/2)+10||0,
      ranged_attack:Math.round(aim/2+strenght/8+stamina/8)+10||0,
      physical_defence:Math.round(stamina)+10||0,
      ranged_defence:Math.round(aim/2+stamina/2)+10||0,
      accuracy:Math.round(aim)+10||0,
      evasion:Math.round(speed/2)+10||0,
      initiative:Math.round(speed+intelligence)+10||0,
    }
  }

  protected _upgrade_tree: ArrayTree<Upgrade> | tree_node<UpgradeOptions>[] = [
    {value:{Factory:'Upgrade',type:'Charm'}      ,children:[
      {value:{Factory:'Upgrade',type:'Fright'},children:[
        {value:{Factory:'Upgrade',type:'Grappler'},children:[]},
        {value:{Factory:'Upgrade',type:'Poison Rush'},children:[]},
      ]},
      {value:{Factory:'Upgrade',type:'Grappler'},children:[
        {value:{Factory:'Upgrade',type:'Fright'},children:[]},
        {value:{Factory:'Upgrade',type:'Poison Rush'},children:[]},
      ]},
      {value:{Factory:'Upgrade',type:'Poison Rush'},children:[
        {value:{Factory:'Upgrade',type:'Fright'},children:[]},
        {value:{Factory:'Upgrade',type:'Grappler'},children:[]},
      ]},
    ]},
    {value:{Factory:'Upgrade',type:'Fright'}     ,children:[
      {value:{Factory:'Upgrade',type:'Charm'},children:[
        {value:{Factory:'Upgrade',type:'Grappler'},children:[]},
        {value:{Factory:'Upgrade',type:'Poison Rush'},children:[]},
      ]},
      {value:{Factory:'Upgrade',type:'Grappler'},children:[
        {value:{Factory:'Upgrade',type:'Charm'},children:[]},
        {value:{Factory:'Upgrade',type:'Poison Rush'},children:[]},
      ]},
      {value:{Factory:'Upgrade',type:'Poison Rush'},children:[
        {value:{Factory:'Upgrade',type:'Charm'},children:[]},
        {value:{Factory:'Upgrade',type:'Grappler'},children:[]},
      ]},
    ]},
    {value:{Factory:'Upgrade',type:'Grappler'}   ,children:[
      {value:{Factory:'Upgrade',type:'Fright'},children:[
        {value:{Factory:'Upgrade',type:'Charm'},children:[]},
        {value:{Factory:'Upgrade',type:'Poison Rush'},children:[]},
      ]},
      {value:{Factory:'Upgrade',type:'Charm'},children:[
        {value:{Factory:'Upgrade',type:'Fright'},children:[]},
        {value:{Factory:'Upgrade',type:'Poison Rush'},children:[]},
      ]},
      {value:{Factory:'Upgrade',type:'Poison Rush'},children:[
        {value:{Factory:'Upgrade',type:'Fright'},children:[]},
        {value:{Factory:'Upgrade',type:'Charm'},children:[]},
      ]},
    ]},
    {value:{Factory:'Upgrade',type:'Poison Rush'},children:[
      {value:{Factory:'Upgrade',type:'Fright'},children:[
        {value:{Factory:'Upgrade',type:'Grappler'},children:[]},
        {value:{Factory:'Upgrade',type:'Charm'},children:[]},
      ]},
      {value:{Factory:'Upgrade',type:'Grappler'},children:[
        {value:{Factory:'Upgrade',type:'Fright'},children:[]},
        {value:{Factory:'Upgrade',type:'Charm'},children:[]},
      ]},
      {value:{Factory:'Upgrade',type:'Charm'},children:[
        {value:{Factory:'Upgrade',type:'Fright'},children:[]},
        {value:{Factory:'Upgrade',type:'Grappler'},children:[]},
      ]},
    ]},
  ]
}
