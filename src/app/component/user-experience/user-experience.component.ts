import { MasterService } from 'src/app/service/master.service';
import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Character } from 'src/gameLogic/custom/Class/Character/Character';

@Component({
  selector: 'app-user-experience',
  templateUrl: './user-experience.component.html',
  styleUrls: ['./user-experience.component.css']
})
export class UserExperienceComponent implements OnInit {
  @Input() currentExp:number=0;
  @Input() targetExp:number=0;
  constructor(){}
  ngOnInit(): void {}
  ngOnDestroy(): void { }
  fill(){
    return `${Math.min(this.currentExp/this.targetExp*100,100)}%`;
  }
}
