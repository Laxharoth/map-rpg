import { Component, HostListener, OnInit } from '@angular/core';
import { DescriptionOptions } from 'src/app/classes/Descriptions/Description';
import { Subscription } from 'rxjs';
import { MasterService } from 'src/app/classes/masterService';
import { charTest } from 'src/app/classes/Character/NPC/characterTest';

@Component({
  selector   : 'app-gui',
  templateUrl: './gui.component.html',
  styleUrls  :['./gui.component.css']
})
export class GuiComponent implements OnInit {
  masterService:MasterService;
  currentOptions:Array<DescriptionOptions|null>;

  private descriptionOptions:Array<DescriptionOptions|null>;
  private offset = 0;
  private size   = 8;

  private descriptionSubscription : Subscription;

  user:charTest;

  constructor() {
    this.masterService = new MasterService('save1')
    this.user = new charTest(this.masterService,'player');
    this.masterService.partyHandler.user = this.user;
    this.masterService.partyHandler.setPartyMember(new charTest(this.masterService,'ally 1'),0)

    this.descriptionSubscription=this.masterService.descriptionHandler.onSetDescription().subscribe((description)=>{
      this.offset = 0;
      this.descriptionOptions = description.options;
      this.setCurrentOptions();
    })

    this.masterService.mapHandler.loadRoom(this.masterService.flagsHandler.getFlag("currentroom"));
    this.masterService.flagsHandler.addTime(0);
  }

  ngOnInit(): void { }

  ngOnDestroy(): void {
    this.descriptionSubscription.unsubscribe();
  }

  move(direction:any)
  {
    this.masterService.mapHandler.moveInsideMap(direction);
  }
  @HostListener('body:keydown',["$event"])
  mapmove(event: any): void
  {
    if(event.target.tagName.toLowerCase()==='input')return;
    const isnumber = (string: string) => ['1', '2', '3', '4', '5', '6','7', '8', '9', '0'].includes(string)?string:'';
    switch(event.key){
      case 'w':case 'ArrowUp' :this.move("UP");break;
      case 'a':case 'ArrowLeft' :this.move("LEFT");break;
      case 's':case 'ArrowDown' :this.move("DOWN");break;
      case 'd':case 'ArrowRight':this.move("RIGHT");break;
      case ' ':case 'Enter':this.currentOptions?.[0].action();break;
      default:
        if(isnumber(event.key)){
          let number = event.key==='0'? 10: parseInt(event.key)
          if(!isNaN(number)){
            this.currentOptions?.[number-1]?.action();
          }
        }
        ;
    }
  }
  isSubsetOfOptions():boolean{
    return this.descriptionOptions.length>10;
  }

  isFirst():boolean{
    return this.currentOptions[0] === this.descriptionOptions[0];
  }

  isLast():boolean{
    let compareOptioinIndex = 0;
    while(this.currentOptions[compareOptioinIndex+1] !== null && compareOptioinIndex !=7)compareOptioinIndex++;
    return this.currentOptions[compareOptioinIndex]===this.descriptionOptions.slice(-1)[0];
  }

  private setCurrentOptions()
  {
    if(this.descriptionOptions.length <= 10)
    {
      this.currentOptions = this.descriptionOptions;
      return;
    }
    let aux_currentOptions = this.descriptionOptions.slice(this.offset,this.offset+this.size)
    while(aux_currentOptions.length< this.size) {aux_currentOptions.push(null);}
    aux_currentOptions.push(this.prevOptions);
    aux_currentOptions.push(this.nextOptions);

    this.currentOptions = aux_currentOptions;
  }

  private prevOptions = new DescriptionOptions("<<<",()=>{
    if(this.isFirst())return;
    this.offset-=this.size;
    this.setCurrentOptions();
  })

  private nextOptions = new DescriptionOptions(">>>",()=>{
    if(this.isLast())return;
    this.offset+=this.size;
    this.setCurrentOptions();
  })

}
