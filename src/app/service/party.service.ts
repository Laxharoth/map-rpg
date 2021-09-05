import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Character } from '../classes/Character/Character';

@Injectable({
  providedIn: 'root'
})
export class PartyService {
  private _user:Character;
  private _party: [(Character|null),(Character|null)] = [null,null];

  private partySubject = new Subject<Character>();
  private partyMemberSubject = new Subject<[number,Character]>();

  constructor()
  {
    this._user = null;
  }

  get user(){return this._user;}
  get party():Character[]{return this._party.filter(character=> character!==null);}

  set user(user:Character){this._user = user; this.updateUser()}
  setPartyMember(value:Character,index:number)
  {
    if([0,1].includes(index))
    {
      this._party[index] = value;
    }
    this.updatePartyMember(index);
  }

  updateUser() { this.partySubject.next(this.user); }
  updatePartyMember(index:number) { this.partyMemberSubject.next([index,this._party[index]]); }
  onUpdateUser(): Observable<Character>  {return this.partySubject.asObservable();}
  onUpdatePartyMember():Observable<[number,Character]> {return this.partyMemberSubject.asObservable();}
}
