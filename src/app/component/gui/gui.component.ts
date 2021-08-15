import { Component, OnInit } from '@angular/core';
import { MapHandlerService } from 'src/app/service/map-handler.service';
import { DescriptionHandlerService } from 'src/app/service/description-handler.service';
import { FlagHandlerService } from 'src/app/service/flag-handler.service';
import { Description, DescriptionOptions } from 'src/app/classes/Description';
import { LockMapService } from 'src/app/service/lock-map.service';


@Component({
  selector   : 'app-gui',
  templateUrl: './gui.component.html',
  styleUrls  :['./gui.component.css']
})
export class GuiComponent implements OnInit {
  flagshandler:FlagHandlerService;
  descriptionhandler:DescriptionHandlerService;
  maphandler:MapHandlerService;
  lockmap:LockMapService;

  currentDescription:Description;
  currentOptions:Array<DescriptionOptions|null>;

  private descriptionOptions:Array<DescriptionOptions|null>;
  private offset = 0;
  private size   = 8;
  constructor() {
    this.lockmap =new LockMapService()
    this.flagshandler = new FlagHandlerService('save1');
    this.descriptionhandler = new DescriptionHandlerService(this.lockmap);
    this.maphandler = new MapHandlerService(this.flagshandler,this.descriptionhandler,this.lockmap);
    this.maphandler.loadRoom(this.flagshandler.getFlag("currentroom"));

    this.descriptionhandler.onSetDescription().subscribe((description)=>{
      this.offset = 0;
      this.currentDescription = description;
      this.descriptionOptions = description.options;
      this.setCurrentOptions();
    })
  }

  ngOnInit(): void {
  }

  move(direction:any)
  {
    this.maphandler.moveInsideMap(direction);
  }
  mapmove(event: any): void
  {
    const isnumber = (string: string) => ['1', '2', '3', '4', '5', '6','7', '8', '9', '0'].includes(string)?string:'';
    switch(event.key){
      case 'w':case 'ArrowUp' :this.move("UP");break;
      case 'a':case 'ArrowLeft' :this.move("LEFT");break;
      case 's':case 'ArrowDown' :this.move("DOWN");break;
      case 'd':case 'ArrowRight':this.move("RIGHT");break;
      case ' ':case 'Enter':this.currentDescription?.options?.[0].action();break;
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
