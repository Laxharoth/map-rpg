import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-experience',
  templateUrl: './user-experience.component.html',
  styleUrls: ['./user-experience.component.css']
})
export class UserExperienceComponent implements OnInit {
  @Input() currentExp:number=0;
  @Input() targetExp:number=0;
  ngOnInit(): void {
    return undefined;
  }
  ngOnDestroy(): void {
    return undefined;
  }
  fill(){
    return `${Math.min(this.currentExp/this.targetExp*100,100)}%`;
  }
}
