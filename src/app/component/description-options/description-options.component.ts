import { Component, HostListener, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MasterService } from 'src/app/service/master.service';
import { DescriptionOptions } from 'src/gameLogic/custom/Class/Descriptions/Description';
import { MAXOPTIONSNUMBERPERPAGE } from 'src/gameLogic/custom/customTypes/constants';
import { MakeFilledArray } from 'src/gameLogic/custom/functions/htmlHelper.functions';

@Component({
  selector: 'app-description-options',
  templateUrl: './description-options.component.html',
  styleUrls: ['./description-options.component.css']
})
export class DescriptionOptionsComponent implements OnInit {

  currentOptions:DescriptionOptions[];
  fixed_options:DescriptionOptions[];
  private descriptionOptions:DescriptionOptions[];

  private getDescriptionOptionsSubscription : Subscription;

  private offset = 0;

  constructor(private masterService:MasterService) {
    this.InitializeSubscriptions()
  }

  ngOnInit(): void { }

  ngOnDestroy(): void {
    this.getDescriptionOptionsSubscription.unsubscribe();
  }

  @HostListener('body:keydown',["$event"])
  selectOption(event: any): void
  {
    if(event.target.tagName.toLowerCase()==='input')return;
    const isnumber = (string: string) => ['1', '2', '3', '4', '5', '6','7', '8', '9', '0'].includes(string)?string:'';
    switch(event.key){
      case ' ':case 'Enter':this.currentOptions?.[0].action();break;
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
    this.getDescriptionOptionsSubscription = this.masterService.descriptionHandler.onSetDescription().subscribe((description) => {
      this.offset = 0;
      this.descriptionOptions = description.options;
      this.fixed_options = description.fixed_options;
      this.setCurrentOptions();
    });
    this.descriptionOptions = this.masterService.descriptionHandler.currentDescription.options;
    this.fixed_options = this.masterService.descriptionHandler.currentDescription.fixed_options;
    this.setCurrentOptions();
  }

  private setCurrentOptions()
  {
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
