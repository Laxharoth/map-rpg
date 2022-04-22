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
  fixedOptions!:(SceneOptions|null)[];
  private descriptionOptions!:(SceneOptions|null)[];

  private getDescriptionOptionsSubscription : Subscription|null=null;

  private offset = 0;

  constructor(private masterService:MasterService) {
    this.InitializeSubscriptions()
  }

  ngOnInit(): void {
    return undefined;
  }

  ngOnDestroy(): void {
    if(this.getDescriptionOptionsSubscription)
      this.getDescriptionOptionsSubscription.unsubscribe();
  }

  @HostListener('body:keydown',["$event"])
  selectOption(event: KeyboardEvent): void{
  if((event.target as unknown as HTMLElement)?.tagName.toLowerCase()==='input')return;
    const isnumber = (digit: string) => ['1', '2', '3', '4', '5', '6','7', '8', '9', '0'].includes(digit)?digit:'';
    switch(event.key){
      case ' ':case 'Enter':this.currentOptions?.[0]?.action();break;
      default:
        if(!isnumber(event.key))return;
        const digit = event.key==='0'? 10: Number.parseInt(event.key)
        if(!isNaN(digit) && !this.currentOptions?.[digit-1]?.disabled){
          this.currentOptions?.[digit-1]?.action();
        }
    }
  }
  private isFirst():boolean{ return this.currentOptions?.[0] === this.descriptionOptions?.[0]; }
  private isLast():boolean{ return this.offset+MAXOPTIONSNUMBERPERPAGE >= this.descriptionOptions.length; }
  private InitializeSubscriptions() {
    this.getDescriptionOptionsSubscription = this.masterService.sceneHandler.onSetScene().subscribe((scene) => {
      this.offset = 0;
      this.descriptionOptions = scene.options;
      this.fixedOptions = fillFixedOptions(scene.fixedOptions as SceneOptions[]);
      this.setCurrentOptions();
    });
    if(this.masterService.sceneHandler.currentScene){
      this.descriptionOptions = this.masterService.sceneHandler.currentScene.options;
      this.fixedOptions = fillFixedOptions(this.masterService.sceneHandler.currentScene.fixedOptions as SceneOptions[]);
    }
    this.setCurrentOptions();
  }
  private setCurrentOptions(){
    const auxCurrentOptions = this.descriptionOptions.slice(this.offset,this.offset+MAXOPTIONSNUMBERPERPAGE)
    auxCurrentOptions.push(...MakeFilledArray(MAXOPTIONSNUMBERPERPAGE-auxCurrentOptions.length,null))
    this.currentOptions = auxCurrentOptions;
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
