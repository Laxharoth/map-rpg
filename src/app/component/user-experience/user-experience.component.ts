import { MasterService } from 'src/app/service/master.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-experience',
  templateUrl: './user-experience.component.html',
  styleUrls: ['./user-experience.component.css']
})
export class UserExperienceComponent implements OnInit {

  current_exp:number;
  target_exp:number;
  constructor(private masterService:MasterService){
    this.masterService.partyHandler.onUpdateUser().subscribe( player => {
      this.current_exp = player.level_stats.experience;
      this.target_exp = 200;
    } );
    this.current_exp = this.masterService.partyHandler.user.level_stats.experience;
    this.target_exp = 200;
  }

  ngOnInit(): void {
  }

  fill()
  {
    return `10%`;
  }
}
