import { Character } from 'src/app/classes/Character/Character';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-party-member',
  templateUrl: './party-member.component.html',
  styleUrls: ['./party-member.component.css']
})
export class PartyMemberComponent implements OnInit {

  @Input() partyMember:Character;

  constructor() { }

  ngOnInit(): void { }

}
