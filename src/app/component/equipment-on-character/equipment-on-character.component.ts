import { Component, Input, OnInit } from '@angular/core';
import { Character } from 'src/gameLogic/custom/Class/Character/Character';

@Component({
  selector: 'app-equipment-on-character',
  templateUrl: './equipment-on-character.component.html',
  styleUrls: ['./equipment-on-character.component.css']
})
export class EquipmentOnCharacterComponent implements OnInit {
  @Input() character: Character;

  constructor() { }

  ngOnInit(): void {
  }
  unequip_meele() { this.character.unequipMelee(); }
  unequip_ranged(){ this.character.unequipRanged();}
  unequip_shield(){ this.character.unequipShield();}
  unequip_armor() { this.character.unequipArmor(); }
}
