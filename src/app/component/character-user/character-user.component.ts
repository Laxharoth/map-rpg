import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Character } from 'src/app/classes/Character/Character';
import { MasterService } from 'src/app/classes/masterService';

@Component({
  selector: 'app-character-user',
  templateUrl: './character-user.component.html',
  styleUrls: ['./character-user.component.css']
})
export class CharacterUserComponent implements OnInit {

  @Input() masterService:MasterService;

  character:Character;
  private characterSubscription:Subscription;

  constructor() { }

  ngOnInit(): void {
    this.character = this.masterService.partyHandler.user;
    this.characterSubscription = this.masterService.partyHandler.onUpdateUser().subscribe(data=>{ this.character = data; });
  }

  ngOnDestroy(): void { this.characterSubscription.unsubscribe(); }
}
