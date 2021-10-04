import { Observable, Subject } from 'rxjs';
import { Character } from '../classes/Character/Character';
import { EnemyFormation } from '../classes/Character/NPC/EnemyFormations/EnemyFormation';

export class EnemyFormationService {

  private _enemyFormation:EnemyFormation;
  private enemyFormationSubject = new Subject<EnemyFormation>();
  private enemySubject = new Subject<[number,Character]>();

  constructor() { }

  get enemyFormation():EnemyFormation { return this._enemyFormation}
  set enemyFormation(value:EnemyFormation)
  {
    this._enemyFormation = value;
    this.enemyFormationSubject.next(this._enemyFormation);
  }

  updateEnemy(index:number){ this.enemySubject.next([index,this.enemyFormation.enemies[index]]); }
  onUpdateEnemy():Observable<[number,Character]>{ return this.enemySubject.asObservable()}

  onSetEnemyFormation():Observable<EnemyFormation>{ return this.enemyFormationSubject.asObservable();}
}
