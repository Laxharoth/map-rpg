import { specialsname } from "src/app/customTypes/itemnames";
import { Character } from "../../Character/Character";
import { Item } from "../Item";

export abstract class SpecialAttack extends Item
{
    cooldown: number = 0;
    abstract get name():specialsname;
    disabled(user:Character): boolean { return this.cooldown > 0;}

    get isBattleUsable(): boolean { return true; }
    get isBattleUsableOnly(): boolean { return true; }
}
