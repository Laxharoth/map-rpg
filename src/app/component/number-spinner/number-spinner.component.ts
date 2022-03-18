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
  @Input() show_input:boolean = true;
  @Input() disable_up:boolean = false;
  @Input() disable_down:boolean = false;
  @Output() SpinnerChangedEvent = new EventEmitter<number>();

  constructor() { }

  ngOnInit(): void {}

  ngAfterViewInit(): void {}
  changeInput(change:number){
    const new_value = Math.max(
      this.min,
      Math.min(this.max,this.value+change)
    );
    if(this.value===new_value ||
      (this.disable_up && this.value < new_value)||
      (this.disable_down && this.value > new_value))return;
    this.value = new_value;
    this.emmitChange()
  }
  emmitChange(){
    this.SpinnerChangedEvent.emit(this.value);
  }
}
