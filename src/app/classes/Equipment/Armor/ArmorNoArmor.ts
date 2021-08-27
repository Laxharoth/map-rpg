import { ActionOutput } from "src/app/customTypes/customTypes";
import { tag } from "src/app/customTypes/tags";
import { Character } from "../../Character/Character";
import { Armor } from "./Armor";

export class ArmorNoArmor extends Armor
{
    protected statsModifier = {}
    get name(): string { return 'No Armor'; }
    canEquip(character: Character): boolean { return false; }
    get tags(): tag[] { return ['no armor']; }
    get isSingleTarget(): boolean { return true; }
}