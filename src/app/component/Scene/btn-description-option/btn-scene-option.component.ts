import { descriptable } from 'src/gameLogic/custom/Class/GameElementDescription/GameElementDescription';
import { Component, OnInit, Input } from '@angular/core';
import { DescriptableSceneOptions, SceneOptions } from 'src/gameLogic/custom/Class/Scene/Scene';

@Component({
  selector: 'app-btn-scene-option',
  templateUrl: './btn-scene-option.component.html',
  styleUrls: ['./btn-scene-option.component.css']
})
export class BtnSceneOptionComponent implements OnInit {
  @Input()option!:SceneOptions;
  constructor() { }

  ngOnInit(): void {}

  get is_descriptable(): boolean {
    return Boolean(this.option)&&(this.option as DescriptableSceneOptions).descriptable !== undefined;
  }
  get has_description(): boolean {
    if(this.is_descriptable){
      return this.descriptable.description.some(section => section.section_items.length);
    }
    return false;
  }
  get descriptable():descriptable{
    if(this.is_descriptable){ return (this.option as DescriptableSceneOptions).descriptable; }
    console.warn(`not found description in ${JSON.stringify(this.option)}`)
    return { get description(){ return [] } }
  }
}
