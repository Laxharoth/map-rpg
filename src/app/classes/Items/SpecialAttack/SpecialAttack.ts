import { Item } from "../Item";

export abstract class SpecialAttack extends Item
{
    cooldown: number = 0;
    get disabled(): boolean { return this.cooldown > 0;}

    get isBattleUsable(): boolean { return true; }
    get isBattleUsableOnly(): boolean { return true; }
}