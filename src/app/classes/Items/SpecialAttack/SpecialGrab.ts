import { ActionOutput } from "src/app/customTypes/customTypes";
import { pushBattleActionOutput } from "src/app/htmlHelper/htmlHelper.functions";
import { Character } from "../../Character/Character";
import { StatusGrappled } from "../../Character/Status/StatusTemporal/Ailments/StatusGrappled";
import { StatusGrappling } from "../../Character/Status/StatusTemporal/Ailments/StatusGrappling";
import { SpecialAttack } from "./SpecialAttack";

export class SpecialGrab extends SpecialAttack
{
    get name(): string { return 'Grab' }
    get isPartyUsable(): boolean { return false }
    get isEnemyUsable(): boolean { return true }
    get isSelfUsableOnly(): boolean { return false }
    get isSingleTarget(): boolean { return true }

    itemEffect(user:Character,target: Character): ActionOutput {
        const description:ActionOutput = [[],[]];
        pushBattleActionOutput(user.addStatus(new StatusGrappling(this.masterService,target)),description)
        pushBattleActionOutput(target.addStatus(new StatusGrappled(this.masterService,user)),description)
        this.cooldown = 6;
        return pushBattleActionOutput(super.itemEffect(user,target),description);
    }
}