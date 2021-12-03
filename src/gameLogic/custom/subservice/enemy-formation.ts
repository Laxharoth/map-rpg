import { Observable, Subject } from 'rxjs';
import { Character } from 'src/gameLogic/custom/Class/Character/Character';
import { EnemyFormation } from 'src/gameLogic/custom/Class/Character/NPC/EnemyFormations/EnemyFormation';

export class EnemyFormationService {

  private _enemyFormation:EnemyFormation;
  private enemyFormationSubject = new Subject<EnemyFormation>();
  private enemySubject = new Subject<[number,Character]>();

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
