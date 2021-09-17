import { ActionOutput } from "src/app/customTypes/customTypes";
import { specialsname } from "src/app/customTypes/itemnames";
import { pushBattleActionOutput } from "src/app/htmlHelper/htmlHelper.functions";
import { Character } from "../../Character/Character";
import { StatusFright } from "../../Character/Status/StatusTemporal/Ailments/StatusFright";
import { SpecialAttack } from "./SpecialAttack";

export class SpecialFright extends SpecialAttack
{
    get name(): specialsname { return 'Fright' }
    get isPartyUsable(): boolean { return false }
    get isEnemyUsable(): boolean { return true }
    get isSelfUsableOnly(): boolean { return false }
    get isSingleTarget(): boolean { return true }

    itemEffect(user:Character,target: Character): ActionOutput
    {
        const description:ActionOutput = [[],[]];
        pushBattleActionOutput(target.addStatus(new StatusFright(this.masterService,target,user)), description)
        this.cooldown=4;
        return pushBattleActionOutput(super.itemEffect(user,target), description);
    }

}
