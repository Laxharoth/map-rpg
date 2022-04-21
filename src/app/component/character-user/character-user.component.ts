import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MasterService } from "src/app/service/master.service";
import { Character } from 'src/gameLogic/custom/Class/Character/Character';
import { Status } from 'src/gameLogic/custom/Class/Status/Status';

@Component({
  selector: 'app-character-user',
  templateUrl: './character-user.component.html',
  styleUrls: ['./character-user.component.css']
})
export class CharacterUserComponent implements OnInit {
  character:Character;
  private characterSubscription:Subscription;

  constructor(private masterService:MasterService){
    this.character = this.masterService.partyHandler.user;
    this.characterSubscription = this.masterService.partyHandler.onUpdateUser().subscribe(data=>{ this.character = data; });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void { this.characterSubscription.unsubscribe(); }

  getCharacterStatus():Status[] {
    const status:Status[] = [];
    for(const characterStatus of this.character.iterStatus())status.push(characterStatus)
    return status;
  }
  get currentExp(){return this.character.battleClass.currentLevelExperience(this.character.levelStats);}
  get targetExp(){return this.character.battleClass.totalExperienceToNextLevel(this.character.levelStats.level);}
}
