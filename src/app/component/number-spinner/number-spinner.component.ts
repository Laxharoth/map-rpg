import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import * as jQuery from 'jquery';

@Component({
  selector: 'app-number-spinner',
  templateUrl: './number-spinner.component.html',
  styleUrls: ['./number-spinner.component.css']
})
export class NumberSpinnerComponent implements OnInit {

  @Input() spinnerType:'horizontal'|'vertical'='horizontal';
  @Input() initialValue:number;
  @Output() SpinnerChangedEvent = new EventEmitter<number>();
  @ViewChild('InputValue') inputValue: ElementRef;
  constructor() { }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    jQuery(this.inputValue.nativeElement)
      .val(this.initialValue)
      .on('change',()=>{this.emmitChange()});
  }
  changeInput(change:number)
  {
    const $input = jQuery(this.inputValue.nativeElement)
    const currentVal = Number.parseInt($input.val() as string);
    const changedValue = currentVal + change
    $input.val(changedValue)
          .trigger('change');
  }
  emmitChange()
  {
    const $input = jQuery(this.inputValue.nativeElement)
    const min = Number.parseFloat($input.attr('min'));
    const max = Number.parseFloat($input.attr('max'));
    $input.val(Math.max(min,this.InputValue))
          .val(Math.min(max,this.InputValue))
    this.SpinnerChangedEvent.emit(this.InputValue);
  }
  private get InputValue():number
  {
    const $input = jQuery(this.inputValue.nativeElement)
    return Number.parseInt($input.val() as string) || this.initialValue;
  }
}
