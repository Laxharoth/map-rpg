import { Component, Input, OnInit } from '@angular/core';
import { Character } from 'src/gameLogic/custom/Class/Character/Character';
import { Status } from 'src/gameLogic/custom/Class/Status/Status';


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
