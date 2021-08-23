import { battleActionOutput } from "src/app/customTypes/customTypes";
import { Character } from "../../Character/Character";
import { Description, DescriptionOptions } from "../../Descriptions/Description";
import { SpecialAttack } from "./SpecialAttack";

export class OnePunch extends SpecialAttack
{
    cooldown: number;
    get name(): string { return "One Punch"; }
    get isPartyUsable(): boolean { return false; }
    get isEnemyUsable(): boolean { return true; }
    get isSelfUsableOnly(): boolean { return false; }
    get isSingleTarget(): boolean { return true; }
    itemEffect(user:Character ,target: Character): battleActionOutput {
        this.cooldown = 10000;
        target.stats.hitpoints = 0;
        return [[new Description(()=>`${user.name.toUpperCase()} OHKO ${target.name}!`,
            [new DescriptionOptions('NEXT!!',()=>{this.masterService.descriptionHandler.nextDescription(false)})])],[]]
    }
    
}