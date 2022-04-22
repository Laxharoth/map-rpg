import { Descriptable } from 'src/gameLogic/custom/Class/GameElementDescription/GameElementDescription';
import { Component, OnInit, Input } from '@angular/core';
import { runWrappedAction, DescriptableSceneOptions, SceneOptions } from 'src/gameLogic/custom/Class/Scene/Scene';

@Component({
  selector: 'app-btn-scene-option',
  templateUrl: './btn-scene-option.component.html',
  styleUrls: ['./btn-scene-option.component.css']
})
export class BtnSceneOptionComponent implements OnInit {
  @Input()option!:SceneOptions|null;
  ngOnInit(): void {
    return undefined;
  }

  get isDescriptable(): boolean {
    return Boolean(this.option)&&(this.option as DescriptableSceneOptions).descriptable !== undefined;
  }
  get hasDescription(): boolean {
    if(this.isDescriptable){
      return this.descriptable.description.some(section => section.section_items.length);
    }
    return false;
  }
  get descriptable():Descriptable{
    if(this.isDescriptable){ return (this.option as DescriptableSceneOptions).descriptable; }
    console.warn(`not found description in ${JSON.stringify(this.option)}`)
    return { get description(){ return [] } }
  }
}
