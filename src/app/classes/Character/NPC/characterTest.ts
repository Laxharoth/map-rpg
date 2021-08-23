import { battleActionOutput } from "src/app/customTypes/customTypes";
import { randomBetween } from "src/app/htmlHelper/htmlHelper.functions";
import { MasterService } from "../../masterService";
import { Character } from "../Character";
import { Reaction } from "../Reaction/Reaction";

export class charTest extends Character
{
    protected reactions: Reaction[] = [];
    private _name!:string;
    constructor(masterService:MasterService ,name)
    { super(200,100,20,20,20,0,0,0,0,0,0,0,0,0,[],[],masterService); this._name = name}
    
    get name(): string { return this._name; }
    IA_Action(ally: Character[], enemy: Character[]): battleActionOutput {
        const target = randomBetween(0,enemy.length);
        switch (randomBetween(0,2))
        {
            //ATTACK
            case 0: return this.Attack([enemy[target]]);
            //RANGE
            case 1: return this.Shoot(enemy);
            //DEFEND
            case 2: return this.Defend([this]);
            default: return [[],[]];
        }
    }
}