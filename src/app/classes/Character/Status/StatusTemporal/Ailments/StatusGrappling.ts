import { MasterService } from "src/app/classes/masterService";
import { ActionOutput } from "src/app/customTypes/customTypes";
import { statusname } from "src/app/customTypes/statusnames";
import { tag } from "src/app/customTypes/tags";
import { pushBattleActionOutput } from "src/app/htmlHelper/htmlHelper.functions";
import { Character } from "../../../Character";
import { StatusBattle } from "../../StatusBattle";

export class StatusGrappling extends StatusBattle
{
    protected DURATION: number = 4;
    private _target:Character;

    constructor(masterService:MasterService,target:Character)
    {
        super(masterService)
        this._target = target;
    }

    get description(): string {
        return 'Being grabbed by something impedes movements.';
    }
    protected effect(target: Character): ActionOutput {
        target.roundStats.speed = 0;
        return [[],[`${target.name} is grabbing ${this._target.name}`]];
    }
    get name(): statusname {
        return 'Grappling';
    }
    onStatusGainded(target: Character):ActionOutput
    {
        const description:ActionOutput = [[],[`${target.name} is grabbing ${this._target.name}`]]
        return pushBattleActionOutput(super.onStatusGainded(target),description);
    }
    onStatusRemoved(target: Character): ActionOutput
    {
        const effectEndedDescription = this._target.removeStatus('Grappled');
        return pushBattleActionOutput(super.onStatusRemoved(target), effectEndedDescription);
    }
    canAttack(target: Character): boolean {return this._target === target;}
    get target(): Character { return this._target}
    get tags(): tag[] { return super.tags.concat(['grappling'])}
}
