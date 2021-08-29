import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Character } from '../classes/Character/Character';

@Injectable({
  providedIn: 'root'
})
export class PartyService {
  private _user:Character;
  private _party: [(Character|null),(Character|null)] = [null,null];

  private userSubject = new Subject<Character>();
  private partySubject = new Subject<Character[]>();

  constructor()
  {
    this._user = null;
  }

  get user(){return this._user;}
  get party():Character[]{return this._party.filter(character=> character!==null);}

  set user(user:Character){this._user = user; this.updateUser()}
  setPartyMember(value:Character,index:number){if([0,1].includes(index))this.party[index] = value; this.updatePartyMember(index)}

  updateUser() { this.userSubject.next(this.user); }
  updatePartyMember(index:number) { this.partySubject.next(this._party); }
  onUpdateUser(): Observable<Character>  {return this.userSubject.asObservable();}
  onUpdateParty():Observable<Character[]>{return this.partySubject.asObservable();}
}
