
import { MasterService } from "src/app/service/master.service";
import { Character } from 'src/gameLogic/custom/Class/Character/Character';
import { ActionOutput } from "src/gameLogic/custom/Class/Character/Character.type";
import { statusname } from "src/gameLogic/custom/Class/Status/Status.type";
import { StatusBattle, StatusPreventAttack } from "src/gameLogic/custom/Class/Status/StatusBattle";
import { tag } from "src/gameLogic/custom/customTypes/tags";
import { pushBattleActionOutput } from "src/gameLogic/custom/functions/htmlHelper.functions";

export class StatusGrappled extends StatusBattle  implements StatusPreventAttack
{
  discriminator: "StatusPreventAttack"="StatusPreventAttack";
  protected DURATION: number = Infinity;
  private _source:Character;
  private _target:Character;

  constructor(masterService:MasterService,source:Character)
  {
      super(masterService)
      this._source = source;
  }

  get description(): string {
      return 'Being grabbed by something impedes movements.'
  }
  protected effect(target: Character): ActionOutput { return [[],[`${target.name} is being grabbed by ${this._source.name}`]]; }
  applyModifiers(character: Character): void { character.calculated_stats.initiative = 0; }
  onStatusGainded(target: Character):ActionOutput
  {
    this._target = target;
    return super.onStatusGainded(target);
  }
  get name(): statusname { return 'Grappled'; }
  canAttack(target: Character): boolean {return this._source === target;}
  preventAttackDescription(target: Character): ActionOutput {
    return [[],[`${this._target.name} can attack only the grappling one.`]];
  }
  get source(): Character {return this._source;}
  onStatusRemoved(target: Character): ActionOutput
  { return pushBattleActionOutput(super.onStatusRemoved(target),[[],[`${target.name} is no loger being grappled`]])}

  get tags(): tag[] { return super.tags.concat(['grappled'])}
}
