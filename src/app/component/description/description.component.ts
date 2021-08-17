import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { inputObject } from 'src/app/customTypes/customTypes';
import { DescriptionHandlerService } from 'src/app/service/description-handler.service';

@Component({
  selector: 'app-description',
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.css']
})
export class DescriptionComponent implements OnInit {

  @Input() descriptionhandler:DescriptionHandlerService;

  //strings for befor and after Input and select
  beforeInput:string;
  afterInput:string;
  beforeSelect:string;
  afterSelect:string;

  //if input goes first and if has input and select
  inputGoesFirst:boolean = false;
  hasInput:boolean = false;
  hasSelect:boolean = false;

  //initial value of input and placeholder
  input:inputObject;
  //select options
  inputOptions:string[];

  private descriptionSubscription:Subscription;

  constructor() { }

  ngOnInit(): void {
    //get original description
    this.updateDescription(this.descriptionhandler.currentDescription?.text());
    this.descriptionSubscription = this.descriptionhandler.onSetTextDescription().subscribe((description)=>{
      this.updateDescription(description)
    });
  }

  ngOnDestroy(): void {
    this.descriptionSubscription.unsubscribe()
  }

  private updateDescription(description: string)
  {
    //originally assume has not input or select
    this.hasInput = false;
    this.hasSelect = false;

    let inputIndex:number,endInputIndex:number,
        selectIndex:number,endselectIndex:number;

    inputIndex = description.indexOf('\\input');
    endInputIndex = description.indexOf('\\',inputIndex+1)+1;
    selectIndex = description.indexOf('\\select');

    this.inputGoesFirst = inputIndex<selectIndex;
    //if there is no input then inputGoesFirst is true since the inputIndex is negative
    let beforeInput='',afterInput=description,beforeSelect='',afterSelect='';

    checkinput:{
      if(inputIndex >= 0 && inputIndex < endInputIndex)
      {
        const inputString = description.slice(inputIndex, endInputIndex);
        [beforeInput,afterInput] = [description.slice(0,inputIndex),description.slice(endInputIndex)]
        this.input = JSON.parse(inputString.slice(6,-1)||'{}') as inputObject;
        this.hasInput = true;
      }
    }
    checkselect:{
      const selectSubString = (this.inputGoesFirst)?afterInput:beforeInput;

      //have to check again since now it's using a substring
      selectIndex = selectSubString.indexOf('\\select');
      endselectIndex = selectSubString.indexOf('\\',selectIndex+1)+1;

      if(selectIndex >= 0 && selectIndex < endselectIndex)
      {
        const selectString = selectSubString.slice(selectIndex, endselectIndex);
        [beforeSelect,afterSelect] = [selectSubString.slice(0,selectIndex),selectSubString.slice(endselectIndex)]
        if(this.inputGoesFirst) afterInput = '';
        else beforeInput = '';

        this.inputOptions = JSON.parse(selectString.slice(7,-1)||'[]') as string[];
        this.hasSelect = true;
      }
    }
    this.beforeInput  = beforeInput;
    this.afterInput   = afterInput;
    this.beforeSelect = beforeSelect;
    this.afterSelect  = afterSelect;
  }
}
