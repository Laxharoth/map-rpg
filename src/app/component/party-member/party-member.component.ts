import { Character } from 'src/app/classes/Character/Character';
import { Component, OnInit, Input } from '@angular/core';
import { Status } from 'src/app/classes/Character/Status/Status';

@Component({
  selector: 'app-party-member',
  templateUrl: './party-member.component.html',
  styleUrls: ['./party-member.component.css']
})
export class PartyMemberComponent implements OnInit {

  @Input() partyMember:Character;
  constructor() { }

  ngOnInit(): void { }

  getCharacterStatus():Status[] {
    const status:Status[] = [];
    for(const characterStatus of this.partyMember.iterStatus())status.push(characterStatus)
    return status;
  }
}
