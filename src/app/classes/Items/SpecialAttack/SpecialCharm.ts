import { ActionOutput } from "src/app/customTypes/customTypes";
import { tag } from "src/app/customTypes/tags";
import { pushBattleActionOutput } from "src/app/htmlHelper/htmlHelper.functions";
import { Character } from "../../Character/Character";
import { StatusCharm } from "../../Character/Status/StatusTemporal/Ailments/StatusCharm";
import { SpecialAttack } from "./SpecialAttack";

export class SpecialCharm extends SpecialAttack
{
    get name(): string { return 'Charm'; }
    get isPartyUsable(): boolean { return false; }
    get isEnemyUsable(): boolean { return true; }
    get isSelfUsableOnly(): boolean { return false; }
    get isSingleTarget(): boolean { return true; }
    itemEffect(user:Character,target: Character): ActionOutput {
        const itemDescription:ActionOutput = [[],[]]
        target.addStatus(new StatusCharm(this.masterService,user,target))
        this.cooldown = 6;
        return pushBattleActionOutput(super.itemEffect(user,target),itemDescription)
    }
}