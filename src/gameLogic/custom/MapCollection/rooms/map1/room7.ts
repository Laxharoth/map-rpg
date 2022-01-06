import { ShopStoreable } from './../../../Class/Shop/DynamicShop';
import { MasterService } from "src/app/service/master.service";
import { flagname } from "src/gameLogic/configurable/subservice/flag-handler.type";
import { testformation } from "src/gameLogic/custom/Class/Character/NPC/EnemyFormations/testformation";
import { DescriptionSelectItemFromMap, drop_item } from "src/gameLogic/custom/Class/Descriptions/CommonOptions";
import { Description, DescriptionOptions } from "src/gameLogic/custom/Class/Descriptions/Description";
import { SetShopDescription } from "src/gameLogic/custom/Class/Descriptions/ShopDescription";
import { Armor, ArmorNoArmor } from "src/gameLogic/custom/Class/Equipment/Armor/Armor";
import { Shield, ShieldNoShield } from "src/gameLogic/custom/Class/Equipment/Shield/Shield";
import { MeleeUnharmed, MeleeWeapon } from "src/gameLogic/custom/Class/Equipment/Weapon/Melee/MeleeWeapon";
import { RangedUnharmed, RangedWeapon } from "src/gameLogic/custom/Class/Equipment/Weapon/Ranged/RangedWeapon";
import { ItemTest } from "src/gameLogic/custom/Class/Items/ItemTest";
import { Room } from "src/gameLogic/custom/Class/maps/room";
import { PerkUpgradeable } from "src/gameLogic/custom/Class/Perk/PerkUpgradeable";
import { DynamicShop } from "src/gameLogic/custom/Class/Shop/DynamicShop";
import { StaticShop } from "src/gameLogic/custom/Class/Shop/StaticShop";
import { fillItemStoreable } from 'src/gameLogic/custom/Class/Items/Item';
import { Battle } from 'src/gameLogic/custom/Class/Battle/Battle';
import { AddExceedItem } from 'src/gameLogic/custom/Class/Descriptions/DescriptionAddExceedItem';

export function room(masterService:MasterService):Room
{
  const roomName = 'room7'
  let dynamicShop:DynamicShop = null;
  const $flag = (name:flagname) => masterService.flagsHandler.getFlag(name);
  const user = masterService.partyHandler.user;
  const equipMelee = new DescriptionOptions(user.character_equipment.meleeWeapon instanceof MeleeUnharmed?'Equip Melee':"Unequip",function(){
    if(user.character_equipment.meleeWeapon instanceof MeleeUnharmed)
    {
      const melee = user.inventory.items.find(item=>item instanceof MeleeWeapon)
      user.useItem(melee,[user]).excecute();
      this.text='Unequip'
    }
    else
    {
      user.unequipMelee();
      this.text='Equip Melee'
    }
    console.log(user)
  },user.inventory.items.every(item=>!(item instanceof MeleeWeapon)))
  const equipRanged = new DescriptionOptions(user.character_equipment.rangedWeapon instanceof RangedUnharmed?'Equip ranged':"Unequip",function(){
    if(user.character_equipment.rangedWeapon instanceof RangedUnharmed)
    {
      const ranged = user.inventory.items.find(item=>item instanceof RangedWeapon)
      user.useItem(ranged,[user]).excecute();
      this.text='Unequip'
    }
    else
    {
      user.unequipRanged();
      this.text='Equip ranged'
    }
    console.log(user)
  },user.inventory.items.every(item=>!(item instanceof RangedWeapon)))
  const equipShield = new DescriptionOptions(user.character_equipment.shield instanceof ShieldNoShield?'Equip Shield':"Unequip",function(){
    if(user.character_equipment.shield instanceof ShieldNoShield)
    {
      const shield = user.inventory.items.find(item=>item instanceof Shield)
      user.useItem(shield,[user]).excecute();
      this.text='Unequip'
    }
    else
    {
      user.unequipShield();
      this.text='Equip Shield'
    }
    console.log(user)
  },user.inventory.items.every(item=>!(item instanceof Shield)))
  const equipArmor = new DescriptionOptions(user.character_equipment.armor instanceof ArmorNoArmor?'Equip Armor':"Unequip",function(){
    if(user.character_equipment.armor instanceof ArmorNoArmor)
    {
      const armor = user.inventory.items.find(item=>item instanceof Armor)
      user.useItem(armor,[user]).excecute();
      this.text='Unequip'
    }
    else
    {
      user.unequipArmor();
      this.text='Equip Armor'
    }
    console.log(user)
  },user.inventory.items.every(item=>!(item instanceof Armor)))
  const nextOption      = new DescriptionOptions("next",function(){masterService.descriptionHandler.nextDescription()});
  const roomOptions =[
    new DescriptionOptions("Shop",makeShop),
    new DescriptionOptions("Dynamic Shop",makeDynamicShop),
    new DescriptionOptions("test battle",()=>new Battle(masterService, new testformation(masterService)).startRound()),
    new DescriptionOptions("Add perk point",()=>{
      user.level_stats.perk_point=4;
      user.emit_perk_up();
    }),
    new DescriptionOptions("Add stats point",()=>{
      user.level_stats.level=4;
      user.level_stats.upgrade_point=4;
      user.emit_stat_up();
    }),
    equipMelee,
    equipRanged,
    equipShield,
    equipArmor,
    new DescriptionOptions("Add Test Item",function(){
      const item = new ItemTest(masterService);
      item.amount = 9;
      user.inventory.addItem(item);
    }),
    drop_item(masterService,user),
    new DescriptionOptions("level up perk",function(){
      const perk = (user.getPerk('Perk Upgrade') as PerkUpgradeable);
      if(!perk) user.addPerk(new PerkUpgradeable(this.masterService));
      else perk.level++;
    }),
    DescriptionSelectItemFromMap(masterService),
    new DescriptionOptions("option3",function(){})
  ]
  const roomDescription  = new Description(function(){return `This actually looks the same`},roomOptions)
  const cantGoThere      = new Description(function(){return `I didn't wanted to go there anyway`},[nextOption]);
  const cantGoThereYet   = new Description(function(){return `I didn't wanted to go there yet anyway`},[nextOption]);
  const goBackThere      = new Description(function(){return `Guess I will go back`},[nextOption]);
  const goBackThere2     = new Description(function(){return `little choices i have`},[nextOption]);
  const room = new Room({
    onEnter  : () => {
      masterService.descriptionHandler.tailDescription(roomDescription,'map')
      masterService.descriptionHandler.nextDescription();
    },
    onExit   : () => {},
    beforeMoveTo(roomName){
      //if(["room6","room8"].includes(roomName))
      if(["room6"].includes(roomName))
      {
        masterService.descriptionHandler.headDescription(cantGoThere,'map');
        masterService.descriptionHandler.setDescription();
        return false;
      }
      if(["room8"].includes(roomName) && $flag("firstreturn2room1"))
      {
        masterService.descriptionHandler.headDescription(cantGoThereYet,'map');
        masterService.descriptionHandler.setDescription();
        return false;
      }
      if(roomName === "room1")
      {
        if($flag("firstreturn2room1"))
        {
          masterService.flagsHandler.setFlag("firstreturn2room1",false);
          masterService.descriptionHandler.tailDescription([goBackThere,goBackThere2],'map');
        }
      }
      return true;
    },
    icon:""
    })
  return room;

  function makeShop():void
  {
    const shop = new StaticShop('test-shop'
      ,['item-test','Shield test','Armor Test','Guard Shield','Poison Pill']
      ,()=>'this is a static stock shop'
      ,masterService
      ,{'item-test':10,'Shield test':15,'Armor test':20}
    );
    SetShopDescription(masterService,shop);
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
          fillItemStoreable({type:'Shield test',amount:5}),
          fillItemStoreable({type:'Armor Test',amount:5}),
        ]
      }
      dynamicShop.fromJson(items)
    }
    SetShopDescription(masterService,dynamicShop);
  }
}

