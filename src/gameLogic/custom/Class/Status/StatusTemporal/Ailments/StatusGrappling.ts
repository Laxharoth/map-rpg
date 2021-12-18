import { ActionOutput } from 'src/gameLogic/custom/Class/Character/Character.type';
import { MasterService } from "src/app/service/master.service";
import { Character } from 'src/gameLogic/custom/Class/Character/Character';
import { statusname } from "src/gameLogic/custom/Class/Status/Status.type";
import { tag } from "src/gameLogic/custom/customTypes/tags";
import { pushBattleActionOutput } from "src/gameLogic/custom/functions/htmlHelper.functions";
import { StatusBattle, StatusPreventAttack } from "../../StatusBattle";

export class StatusGrappling extends StatusBattle implements StatusPreventAttack
{
  discriminator: "StatusPreventAttack"="StatusPreventAttack";
  protected DURATION: number = 4;
  private _source:Character;
  private _target:Character;

  constructor(masterService:MasterService,target:Character)
  {
      super(masterService);
      this._target = target;
  }

  get description(): string {
  return 'Being grabbed by something impedes movements.';
  }
  protected effect(target: Character): ActionOutput { return [[],[`${target.name} is grabbing ${this._target.name}`]]; }
    get name(): statusname {
      return 'Grappling';
    }
    onStatusGainded(target: Character):ActionOutput
    {
      this._source = target;
      const description:ActionOutput = [[],[`${target.name} is grabbing ${this._target.name}`]];
      return pushBattleActionOutput(super.onStatusGainded(target),description);
    }
    onStatusRemoved(target: Character): ActionOutput
    {
      const effectEndedDescription = this._target.removeStatus('Grappled');
      return pushBattleActionOutput(super.onStatusRemoved(target), effectEndedDescription);
    }
    canAttack(target: Character): boolean {return this._target === target;}
    preventAttackDescription(target: Character): ActionOutput {
      return [[],[`${this._source.name} can attack only the grapped one.`]];
    }
  get target(): Character { return this._target;}
  get tags(): tag[] { return super.tags.concat(['grappling']);}
}
