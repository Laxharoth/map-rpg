import { ArmorNoArmor } from './../classes/Equipment/Armor/ArmorNoArmor';
import { testformation } from "../classes/Character/NPC/EnemyFormations/testformation";
import { Description, DescriptionOptions } from "../classes/Descriptions/Description";
import { descriptionBattle } from "../classes/Descriptions/BattleDescription";
import { ShieldNoShield } from "../classes/Equipment/Shield/ShieldNoShield";
import { MeleeUnharmed } from "../classes/Equipment/Weapon/Melee/MeleeUnharmed";
import { RangedUnharmed } from "../classes/Equipment/Weapon/Ranged/RangedUnharmed";
import { Room } from "../classes/maps/room";
import { MasterService } from "src/app/service/master.service";
import { ItemTest } from '../classes/Items/ItemTest';
import { PerkUpgradeable } from '../classes/Perk/PerkUpgradeable';
import { DescriptionSelectItemFromMap } from '../classes/Descriptions/CommonOptions';
import { Shop } from '../classes/Shop/Shop';
import { SetShopDescription } from '../classes/Descriptions/ShopDescription';
import { StaticShop } from '../classes/Shop/StaticShop';

export function room(masterService:MasterService):Room
{
  const roomName = 'room7'
  const $flag = (name:string) => masterService.flagsHandler.getFlag(name);
  const user = masterService.partyHandler.user;
  let melee = user.inventary[0];
  let ranged = user.inventary[1];
  let shield = user.inventary[2];
  let armor = user.inventary[3];
  const equipMelee = new DescriptionOptions(user.meleeWeapon instanceof MeleeUnharmed?'Equip Melee':"Unequip",function(){
    if(user.meleeWeapon instanceof MeleeUnharmed)
    {
      user.useItem(melee,[user]);
      this.text='Unequip'
    }
    else
    {
      user.unequipMelee();
      this.text='Equip Melee'
    }
    console.log(user)
  })
  const equipRanged = new DescriptionOptions(user.rangedWeapon instanceof RangedUnharmed?'Equip ranged':"Unequip",function(){
    if(user.rangedWeapon instanceof RangedUnharmed)
    {
      user.useItem(ranged,[user]);
      this.text='Unequip'
    }
    else
    {
      user.unequipRanged();
      this.text='Equip ranged'
    }
    console.log(user)
  })
  const equipShield = new DescriptionOptions(user.shield instanceof ShieldNoShield?'Equip Shield':"Unequip",function(){
    if(user.shield instanceof ShieldNoShield)
    {
      user.useItem(shield,[user]);
      this.text='Unequip'
    }
    else
    {
      user.unequipShield();
      this.text='Equip Shield'
    }
    console.log(user)
  })
  const equipArmor = new DescriptionOptions(user.armor instanceof ArmorNoArmor?'Equip Armor':"Unequip",function(){
    if(user.armor instanceof ArmorNoArmor)
    {
      user.useItem(armor,[user]);
      this.text='Unequip'
    }
    else
    {
      user.unequipArmor();
      this.text='Equip Armor'
    }
    console.log(user)
  })
  const nextOption      = new DescriptionOptions("next",function(){masterService.descriptionHandler.nextDescription()});
  const roomOptions =[
    new DescriptionOptions("Shop",makeShop),
    new DescriptionOptions("option1",function(){masterService.flagsHandler.setFlag("",0)}),
    new DescriptionOptions("test battle",function(){ descriptionBattle(masterService,new testformation(masterService) ) }),
    equipMelee,
    equipRanged,
    equipShield,
    equipArmor,
    new DescriptionOptions("Add Test Item",function(){
      const item = new ItemTest(masterService);
      item.amount = 9;
      user.addItem(item);
    }),
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
      ,['item-test','Shield test','Armor Test']
      ,masterService
      ,{'item-test':10,'Shield test':15,'Armor test':20}
    );
    SetShopDescription(masterService,shop);
  }
}

