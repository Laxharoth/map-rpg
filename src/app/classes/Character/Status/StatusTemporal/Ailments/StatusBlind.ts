import { ActionOutput } from "src/app/customTypes/customTypes";
import { statusname } from "src/app/customTypes/statusnames";
import { tag } from "src/app/customTypes/tags";
import { Character } from "../../../Character";
import { StatusFight } from "../../StatusFight"

export class StatusBlind extends StatusFight
{
    protected DURATION: number = 4;
    get name(): statusname { return 'Blind' }
    get description(): string {
        return 'Reduces accuracy and evasion';
    }
    protected effect(target: Character): ActionOutput {
        target.roundStats.evasion=Math.round(0.8*target.roundStats.evasion);
        return [[],[]];
    }
    get tags(): tag[] { return super.tags.concat(['blind'])}
}