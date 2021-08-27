import { ActionOutput } from "src/app/customTypes/customTypes";
import { pushBattleActionOutput } from "src/app/htmlHelper/htmlHelper.functions";
import { Character } from "../../Character/Character";
import { Description, DescriptionOptions } from "../../Descriptions/Description";
import { SpecialAttack } from "./SpecialAttack";

export class OnePunch extends SpecialAttack
{
    get name(): string { return "One Punch"; }
    get isPartyUsable(): boolean { return false; }
    get isEnemyUsable(): boolean { return true; }
    get isSelfUsableOnly(): boolean { return false; }
    get isSingleTarget(): boolean { return true; }
    itemEffect(user:Character ,target: Character): ActionOutput {
        this.cooldown = 10000;
        target.stats.hitpoints = 0;
        const specialDescription:ActionOutput = [[this.specialDescription(user,target)],[]]
        pushBattleActionOutput(super.itemEffect(user,target),specialDescription)
        return specialDescription;
    }
    
    ////////////////////
    /// SPECIAL DESCRIPTION
    ////////////////////
    private specialDescriptionOptions = new DescriptionOptions('NEXT!!',()=>{this.masterService.descriptionHandler.nextDescription(false)})
    private specialDescription =(user:Character,target:Character)=> new Description(()=>`${user.name.toUpperCase()} OHKO ${target.name}!`,[this.specialDescriptionOptions])
}