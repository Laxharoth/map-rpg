import { Component, OnInit, Input } from '@angular/core';
import { game_item_dropable } from 'src/gameLogic/custom/Class/Scene/SceneAddExceedItem';
import { GameItem } from 'src/gameLogic/custom/Class/Items/Item';

@Component({
  selector: 'app-dropable-item',
  templateUrl: './dropable-item.component.html',
  styleUrls: ['./dropable-item.component.css']
})
export class DropableItemComponent implements OnInit {
  @Input()dropable!:game_item_dropable;
  @Input()color:string = "color-6";
  get item():GameItem { return this.dropable[1]}
  get dropped():boolean { return this.dropable[0]}
  constructor() { }
  ngOnInit(): void {}
  toggleDrop(){
    this.dropable[0] = !this.dropable[0]
  }
}
