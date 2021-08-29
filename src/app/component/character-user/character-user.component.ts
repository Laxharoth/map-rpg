import { Component, Input, OnInit, Sanitizer, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { Character } from 'src/app/classes/Character/Character';
import { Status } from 'src/app/classes/Character/Status/Status';
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

  getCharacterStatus():Status[] {
    const status:Status[] = [];
    for(const characterStatus of this.character.iterStatus())status.push(characterStatus)
    return status;
  }
}
