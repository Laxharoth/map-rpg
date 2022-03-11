import { ShopStoreable } from '../../../../gameLogic/custom/Class/Shop/DynamicShop';
import { MasterService } from "src/app/service/master.service";
import { flagname } from "src/gameLogic/configurable/subservice/flag-handler.type";
import { SceneSelectItemFromMap, drop_item, nextOption } from "src/gameLogic/custom/Class/Scene/CommonOptions";
import { Scene, SceneOptions } from "src/gameLogic/custom/Class/Scene/Scene";
import { SetShopScene } from "src/gameLogic/custom/Class/Scene/ShopScene";
import { MeleeUnharmed, MeleeWeapon } from "src/gameLogic/custom/Class/Equipment/Weapon/MeleeWeapon";
import { RangedUnharmed, RangedWeapon } from "src/gameLogic/custom/Class/Equipment/Weapon/RangedWeapon";
import { Room } from "src/gameLogic/custom/Class/maps/room";
import { DynamicShop } from "src/gameLogic/custom/Class/Shop/DynamicShop";
import { StaticShop } from "src/gameLogic/custom/Class/Shop/StaticShop";
import { fillItemStoreable } from 'src/gameLogic/custom/Class/Items/Item';
import { Battle } from 'src/gameLogic/custom/Class/Battle/Battle';
import { Factory } from 'src/gameLogic/core/Factory/Factory';
import { Shield, ShieldNoShield } from 'src/gameLogic/custom/Class/Equipment/Shield';
import { ArmorNoArmor, Armor } from 'src/gameLogic/custom/Class/Equipment/Armor';
import { item_factory_function } from 'src/gameLogic/custom/Factory/ItemFactory';

export function room(masterService:MasterService):Room
{
  const roomName = 'room7'
  let dynamicShop:DynamicShop = null;
  const $flag = (name:flagname) => masterService.flagsHandler.getFlag(name);
  const user = masterService.partyHandler.user;
  const equipMelee = {
    get text(){return user.character_equipment.shield instanceof MeleeUnharmed?'Equip Shield':"Unequip"},
    action:function(){
      if(user.character_equipment.armor instanceof MeleeUnharmed)
      {
        const armor = user.inventory.items.find(item=>item instanceof MeleeWeapon)
        user.useItem(armor,[user]).excecute();
      }
      else
      {
        user.unequipShield();
      }
      console.log(user)
    },
    get disabled(){return !( user.character_equipment.armor instanceof MeleeUnharmed || user.inventory.items.some(item=>!(item instanceof MeleeWeapon)))}
  }
  const equipRanged = {
    get text(){return user.character_equipment.shield instanceof RangedUnharmed?'Equip Shield':"Unequip"},
    action:function(){
      if(user.character_equipment.armor instanceof RangedUnharmed)
      {
        const armor = user.inventory.items.find(item=>item instanceof RangedWeapon)
        user.useItem(armor,[user]).excecute();
      }
      else
      {
        user.unequipShield();
      }
      console.log(user)
    },
    get disabled(){return !( user.character_equipment.armor instanceof RangedUnharmed || user.inventory.items.some(item=>!(item instanceof RangedWeapon)))}
  }
  const equipShield = {
    get text(){return user.character_equipment.shield instanceof ShieldNoShield?'Equip Shield':"Unequip"},
    action:function(){
      if(user.character_equipment.armor instanceof ShieldNoShield)
      {
        const armor = user.inventory.items.find(item=>item instanceof Shield)
        user.useItem(armor,[user]).excecute();
      }
      else
      {
        user.unequipShield();
      }
      console.log(user)
    },
    get disabled(){return !( user.character_equipment.armor instanceof ShieldNoShield || user.inventory.items.some(item=>!(item instanceof Shield)))}
  }
  const equipArmor = {
    get text(){return user.character_equipment.armor instanceof ArmorNoArmor?'Equip Armor':"Unequip"},
    action:function(){
      if(user.character_equipment.armor instanceof ArmorNoArmor)
      {
        const armor = user.inventory.items.find(item=>item instanceof Armor)
        user.useItem(armor,[user]).excecute();
      }
      else
      {
        user.unequipArmor();
      }
      console.log(user)
    },
    get disabled(){return !( user.character_equipment.armor instanceof ArmorNoArmor || user.inventory.items.some(item=>!(item instanceof Armor)))}
  }
  const my_nextOption      = nextOption(masterService)
  const roomOptions:SceneOptions[] =[
    {text:"Shop",action:makeShop,disabled:false},
    {text:"Shop",action:makeDynamicShop,disabled:false},
    {text:"test battle",action:()=>new Battle(masterService, Factory(masterService,{ Factory:"EnemyFormation",type:"testformation" })).startRound(),disabled:false},
    {text:"Add perk point",action:()=>{
      user.level_stats.perk_point=4;
      user.emit_perk_up();
    },disabled:false},
    {text:"Add stats point",action:()=>{
      user.level_stats.level=4;
      user.level_stats.upgrade_point=4;
      user.emit_stat_up();
    },disabled:false},
    equipMelee,
    equipRanged,
    equipShield,
    equipArmor,
    {
      text:"Add Test Item",
      action:function(){
        const item = (Factory as item_factory_function)(masterService,{Factory:"Item",type:"item-test"})
        item.amount = 9;
        user.inventory.addItem(item);
      },
      disabled:false
    }
    ,
    drop_item(masterService,user),
    {
      text:"level up perk",
      action:function(){
        const perk = (user.getPerk('PerkUpgradeable'));
        if(!perk) user.addPerk(Factory(masterService,{Factory:"Perk",type:"PerkUpgradeable"}));
        else
          //@ts-ignore
          perk.level++;
      },
      disabled:false
    },
    SceneSelectItemFromMap(masterService),
    {text:"option3",action:()=>{},disabled:false}
  ]
  const fixed_options:[null, null, null, null, null] = [null, null,null,null,null]
  const [roomScene, cantGoThere, cantGoThereYet, goBackThere, goBackThere2]:Scene[]=[
    {sceneData:function(){return `This actually looks the same`},options:roomOptions,fixed_options},
    {sceneData:function(){return `I didn't wanted to go there anyway`},options:[my_nextOption],fixed_options},
    {sceneData:function(){return `I didn't wanted to go there yet anyway`},options:[my_nextOption],fixed_options},
    {sceneData:function(){return `Guess I will go back`},options:[my_nextOption],fixed_options},
    {sceneData:function(){return `little choices i have`},options:[my_nextOption],fixed_options},
  ]
  const room = {
    onEnter  : () => {
      masterService.sceneHandler.tailScene(roomScene,'map')
      masterService.sceneHandler.nextScene();
    },
    onExit   : () => {},
    beforeMoveTo(roomName){
      //if(["room6","room8"].includes(roomName))
      if(["room6"].includes(roomName))
      {
        masterService.sceneHandler.headScene(cantGoThere,'map');
        masterService.sceneHandler.setScene();
        return false;
      }
      if(["room8"].includes(roomName) && $flag("firstreturn2room1"))
      {
        masterService.sceneHandler.headScene(cantGoThereYet,'map');
        masterService.sceneHandler.setScene();
        return false;
      }
      if(roomName === "room1")
      {
        if($flag("firstreturn2room1"))
        {
          masterService.flagsHandler.setFlag("firstreturn2room1",false);
          masterService.sceneHandler.tailScene([goBackThere,goBackThere2],'map');
        }
      }
      return true;
    },
    icon:""
    }
  return room;

  function makeShop():void
  {
    const shop = new StaticShop('test-shop'
      ,['item-test','ShieldTest','ArmorTest','ShieldGuard','PoisonPill']
      ,()=>'this is a static stock shop'
      ,masterService
      ,{'item-test':10,'Shieldtest':15,'Armortest':20}
    );
    SetShopScene(masterService,shop);
  }
  function makeDynamicShop():void
  {
    if(!dynamicShop)
    {
      dynamicShop = new DynamicShop('test-shop',()=>'This is a dynamic stock shop',masterService,{'item-test':10});
      const items:ShopStoreable = {
        Factory:"Shop",
        type:"this.name",
        Items:[
          fillItemStoreable({type:'item-test',amount:5}),
          fillItemStoreable({type:'ShieldTest',amount:5}),
          fillItemStoreable({type:'ArmorTest',amount:5}),
        ]
      }
      dynamicShop.fromJson(items)
    }
    SetShopScene(masterService,dynamicShop);
  }
}

