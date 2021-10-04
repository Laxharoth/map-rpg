import { Component, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { Character } from 'src/app/classes/Character/Character';
import { MasterService } from "src/app/service/master.service";

@Component({
  selector: 'app-party',
  templateUrl: './party.component.html',
  styleUrls: ['./party.component.css']
})
export class PartyComponent implements OnInit {

  @Input() partyType!:'PARTY'|'ENEMY';
  private _user:Character;
  private _party:Character[];
  private userSubscription:Subscription;
  private partySubscription:Subscription;
  constructor(private masterService:MasterService) {}

  ngOnInit(): void {
    if(this.partyType==='PARTY')
    {
      this._user = this.masterService.partyHandler.user;
      this._party= this.masterService.partyHandler.party;
      this.userSubscription = this.masterService.partyHandler.onUpdateUser().subscribe(user => this._user = user);
      this.partySubscription= this.masterService.partyHandler.onUpdatePartyMember().subscribe(([index,character])=>{
        this._party[index] = character;
      })
    }
    if(this.partyType==='ENEMY')
    {
      this._party= this.masterService.enemyHandler.enemyFormation.enemies;
      this.partySubscription= this.masterService.enemyHandler.onUpdateEnemy().subscribe(([index, character])=>{
        this._party[index] = character
      })
    }
  }

  ngOnDestroy(): void
  {
    if(this.userSubscription) this.userSubscription.unsubscribe();
    if(this.partySubscription)this.partySubscription.unsubscribe();
  }

  get party():Character[]
  {
    const party:Character[] = [this._user].concat(this._party).filter(character=>character);
    return party;
  }
}
