import { Component, HostListener, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MasterService } from 'src/app/service/master.service';
import { SceneOptions } from 'src/gameLogic/custom/Class/Scene/Scene';
import { MAXOPTIONSNUMBERPERPAGE } from 'src/gameLogic/custom/customTypes/constants';
import { MakeFilledArray } from 'src/gameLogic/custom/functions/htmlHelper.functions';

@Component({
  selector: 'app-scene-options',
  templateUrl: './scene-options.component.html',
  styleUrls: ['./scene-options.component.css']
})
export class SceneOptionsComponent implements OnInit {

  currentOptions!:(SceneOptions|null)[];
  fixed_options!:(SceneOptions|null)[];
  private descriptionOptions!:(SceneOptions|null)[];

  private getDescriptionOptionsSubscription : Subscription|null=null;

  private offset = 0;

  constructor(private masterService:MasterService) {
    this.InitializeSubscriptions()
  }

  ngOnInit(): void { }

  ngOnDestroy(): void {
    this.getDescriptionOptionsSubscription&&this.getDescriptionOptionsSubscription.unsubscribe();
  }

  @HostListener('body:keydown',["$event"])
  selectOption(event: any): void{
    if(event.target.tagName.toLowerCase()==='input')return;
    const isnumber = (string: string) => ['1', '2', '3', '4', '5', '6','7', '8', '9', '0'].includes(string)?string:'';
    switch(event.key){
      case ' ':case 'Enter':this.currentOptions?.[0]?.action();break;
      default:
        if(!isnumber(event.key))return;
        let number = event.key==='0'? 10: parseInt(event.key)
        if(!isNaN(number) && !this.currentOptions?.[number-1]?.disabled){
          this.currentOptions?.[number-1]?.action();
        }
    }
  }
  private isFirst():boolean{ return this.currentOptions?.[0] === this.descriptionOptions?.[0]; }
  private isLast():boolean{ return this.offset+MAXOPTIONSNUMBERPERPAGE >= this.descriptionOptions.length; }
  private InitializeSubscriptions() {
    this.getDescriptionOptionsSubscription = this.masterService.sceneHandler.onSetScene().subscribe((scene) => {
      this.offset = 0;
      this.descriptionOptions = scene.options;
      this.fixed_options = fillFixedOptions(scene.fixed_options as SceneOptions[]);
      this.setCurrentOptions();
    });
    if(this.masterService.sceneHandler.currentScene){
      this.descriptionOptions = this.masterService.sceneHandler.currentScene.options;
      this.fixed_options = fillFixedOptions(this.masterService.sceneHandler.currentScene.fixed_options as SceneOptions[]);
    }
    this.setCurrentOptions();
  }
  private setCurrentOptions(){
    let aux_currentOptions = this.descriptionOptions.slice(this.offset,this.offset+MAXOPTIONSNUMBERPERPAGE)
    aux_currentOptions.push(...MakeFilledArray(MAXOPTIONSNUMBERPERPAGE-aux_currentOptions.length,null))
    this.currentOptions = aux_currentOptions;
  }
  prevOptions = {
    text: "<<<",
    action: () => {
      if (this.isFirst()) return;
      this.offset -= MAXOPTIONSNUMBERPERPAGE;
      this.setCurrentOptions();
    },
    _disabled: () => this.isFirst(),
    get disabled(){return this._disabled()}
  }
  nextOptions = {
    text: ">>>",
    action: () => {
      if(this.isLast())return;
    this.offset+=MAXOPTIONSNUMBERPERPAGE;
    this.setCurrentOptions();
    },
    _disabled: () => this.isLast(),
    get disabled(){return this._disabled()}
  }
}
function fillFixedOptions(options:SceneOptions[]|undefined){
  return (options || [ null, null, null, null, null]) as unknown as SceneOptions[];
}
