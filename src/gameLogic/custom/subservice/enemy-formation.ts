import { EnemyFormation } from 'src/gameLogic/custom/Class/Character/NPC/EnemyFormations/EnemyFormation';

export class EnemyFormationService {

  private _enemyFormation:EnemyFormation;

  get enemyFormation():EnemyFormation { return this._enemyFormation}
  set enemyFormation(value:EnemyFormation) { this._enemyFormation = value; }
}
