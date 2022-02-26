import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MasterService } from 'src/app/service/master.service';

@Component({
  selector: 'app-scene',
  templateUrl: './scene.component.html',
  styleUrls: ['./scene.component.css']
})
export class SceneComponent implements OnInit {

  //strings for befor and after Input and select
  /**
   * Text to be displayed before the input element
   *
   * @type {string}
   * @memberof SceneComponent
   */
  beforeInput:string;
  //strings for befor and after Input and select
  /**
   * Text to be displayed after the input element
   *
   * @type {string}
   * @memberof SceneComponent
   */
  afterInput:string;
  //strings for befor and after Input and select
  /**
   * Text to be displayed before the select element
   *
   * @type {string}
   * @memberof SceneComponent
   */
  beforeSelect:string;
  //strings for befor and after Input and select
  /**
   * Text to be displayed after the select element
   *
   * @type {string}
   * @memberof SceneComponent
   */
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

  constructor(private masterService:MasterService)
  {
    //get original description
    this.updateDescription(this.masterService.sceneHandler.currentScene?.sceneData());
    this.descriptionSubscription = this.masterService.sceneHandler.onSetTextScene().subscribe((scene)=>{
      this.updateDescription(scene)
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.descriptionSubscription.unsubscribe()
  }

  private updateDescription(description: string)
  {
    this.beforeInput  = ''
    this.afterInput   = ''
    this.beforeSelect = ''
    this.afterSelect  = ''
    if(typeof description !== 'string')
    { this.beforeInput = 'ERROR description is not a string'; return; }
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

    ({ beforeInput, afterInput } = this.InitializeInputStrings(inputIndex, endInputIndex, description, beforeInput, afterInput));
    ({ afterInput, beforeInput, selectIndex, endselectIndex } = this.InitializeSelectStrings(afterInput, beforeInput, beforeSelect, afterSelect));

    this.beforeInput  = beforeInput;
    this.afterInput   = afterInput;
    this.beforeSelect = beforeSelect;
    this.afterSelect  = afterSelect;
  }

  private InitializeSelectStrings(afterInput: string, beforeInput: string, beforeSelect: string, afterSelect: string) {
    const selectSubString = (this.inputGoesFirst) ? afterInput : beforeInput;

    const selectIndex = selectSubString.indexOf('\\select');
    const endselectIndex = selectSubString.indexOf('\\', selectIndex + 1) + 1;

    if (selectIndex >= 0 && selectIndex < endselectIndex) {
      const selectString = selectSubString.slice(selectIndex, endselectIndex);
      [beforeSelect, afterSelect] = [selectSubString.slice(0, selectIndex), selectSubString.slice(endselectIndex)];
      if (this.inputGoesFirst) afterInput = '';
      else beforeInput = '';

      this.inputOptions = JSON.parse(selectString.slice(7, -1) || '[]') as string[];
      this.hasSelect = true;
    }
    return { afterInput, beforeInput, selectIndex, endselectIndex };
  }

  private InitializeInputStrings(inputIndex: number, endInputIndex: number, description: string, beforeInput: string, afterInput: string) {
    if (inputIndex >= 0 && inputIndex < endInputIndex) {
      const inputString = description.slice(inputIndex, endInputIndex);
      beforeInput = description.slice(0, inputIndex);
      afterInput = description.slice(endInputIndex);
      this.input = JSON.parse(inputString.slice(6, -1) || '{}') as inputObject;
      this.hasInput = true;
    }
    return { beforeInput, afterInput };
  }
}
export interface inputObject {default: string , placeholder: string}