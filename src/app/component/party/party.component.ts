import { Component, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { Character } from 'src/app/classes/Character/Character';
import { MasterService } from 'src/app/classes/masterService';

@Component({
  selector: 'app-party',
  templateUrl: './party.component.html',
  styleUrls: ['./party.component.css']
})
export class PartyComponent implements OnInit {

  @Input() readonly masterService:MasterService;
  user:Character;
  party:Character[];


  private userSubscription:Subscription;
  private partySubject: Subscription;

  constructor() { }

  ngOnInit(): void {
    this.user = this.masterService.partyHandler.user;
    this.party= this.masterService.partyHandler.party;
    this.userSubscription = this.masterService.partyHandler.onUpdateUser().subscribe(data=>{ this.user = data; });
    this.partySubject = this.masterService.partyHandler.onUpdateParty().subscribe(data=>{ this.party = data; });
  }

  ngOnDestroy(): void
  {
    this.userSubscription.unsubscribe();
    this.partySubject.unsubscribe();
  }
}
