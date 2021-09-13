import { MasterService } from "src/app/classes/masterService";
import { ActionOutput } from "src/app/customTypes/customTypes";
import { statusname } from "src/app/customTypes/statusnames";
import { tag } from "src/app/customTypes/tags";
import { pushBattleActionOutput, randomCheck } from "src/app/htmlHelper/htmlHelper.functions";
import { Character } from "../../../Character";
import { StatusBattle } from "../../StatusBattle";

export class StatusFright extends StatusBattle
{
    protected DURATION: number = 3;
    private frighted:Character;
    private frighter:Character;
    constructor(masterService:MasterService, frighted:Character, frighter:Character)
    {
        super(masterService)
        this.frighted = frighted;
        this.frighter = frighter;
    }
    get name(): statusname {
        return 'Fright';
    }
    get description(): string {
        return "Can't hurt fear source.";
    }
    onStatusGainded(target: Character)
    {
        const description:ActionOutput = [[],[`${this.frighted.name} is intimidated by ${this.frighter.name}`]]
        return pushBattleActionOutput(super.onStatusGainded(target),description)
    }
    protected effect(target: Character): ActionOutput { return [[],[`${this.frighted.name} fears ${this.frighter.name}`]]}

    canAttack(target: Character): boolean {if(this.frighter === target) return randomCheck(30); return true;}
    get tags(): tag[] { return super.tags.concat(['fright'])}
}
