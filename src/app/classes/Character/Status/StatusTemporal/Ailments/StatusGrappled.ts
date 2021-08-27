import { MasterService } from "src/app/classes/masterService";
import { ActionOutput } from "src/app/customTypes/customTypes";
import { statusname } from "src/app/customTypes/statusnames";
import { pushBattleActionOutput } from "src/app/htmlHelper/htmlHelper.functions";
import { Character } from "../../../Character";
import { StatusFight } from "../../StatusFight";

export class StatusGrappled extends StatusFight
{
    protected DURATION: number = Infinity;
    private _source:Character;

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
    get name(): statusname {
        return 'Grappled';
    }
    canAttack(target: Character): boolean {return this._source === target;}
    get source(): Character {return this._source;}
    onStatusRemoved(target: Character): ActionOutput
    { return pushBattleActionOutput(super.onStatusRemoved(target),[[],[`${target.name} is no loger being grappled`]])}
}