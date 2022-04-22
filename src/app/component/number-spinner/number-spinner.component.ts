import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-number-spinner',
  templateUrl: './number-spinner.component.html',
  styleUrls: ['./number-spinner.component.css']
})
export class NumberSpinnerComponent implements OnInit {

  @Input() spinnerType:'horizontal'|'vertical'='horizontal';
  @Input() min:number=0;
  @Input() value!:number;
  @Input() max:number=100;
  @Input() step:number=1;
  @Input() showInput:boolean = true;
  @Input() disableUp:boolean = false;
  @Input() disableDown:boolean = false;
  @Output() SpinnerChangedEvent = new EventEmitter<number>();

  ngOnInit(): void {
    return undefined;
  }
  changeInput(change:number){
    const newValue = Math.max(
      this.min,
      Math.min(this.max,this.value+change)
    );
    if(this.value===newValue ||
      (this.disableUp && this.value < newValue)||
      (this.disableDown && this.value > newValue))return;
    this.value = newValue;
    this.emmitChange()
  }
  emmitChange(){
    this.SpinnerChangedEvent.emit(this.value);
  }
}
