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
  @Input() current_exp:number;
  @Input() target_exp:number;
  constructor(){}

  ngOnInit(): void {}
  ngOnDestroy(): void { }
  fill()
  {
    return `${Math.min(this.current_exp/this.target_exp*100,100)}%`;
  }
}
