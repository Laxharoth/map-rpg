import { MasterService } from "src/app/classes/masterService";
import { ActionOutput } from "src/app/customTypes/customTypes";
import { statusname } from "src/app/customTypes/statusnames";
import { tag } from "src/app/customTypes/tags";
import { pushBattleActionOutput } from "src/app/htmlHelper/htmlHelper.functions";
import { Character } from "../../../Character";
import { StatusBattle, StatusPreventAttack } from "../../StatusBattle";

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
    protected effect(target: Character): ActionOutput {
        target.roundStats.speed = 0;
        return [[],[`${target.name} is being grabbed by ${this._source.name}`]];
    }
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
