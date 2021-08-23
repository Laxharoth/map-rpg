import { battleActionOutput } from "src/app/customTypes/customTypes";
import { randomBetween } from "src/app/htmlHelper/htmlHelper.functions";
import { MasterService } from "../../masterService";
import { Character } from "../Character";
import { Reaction } from "../Reaction/Reaction";

export class enemyTest extends Character
{
    protected reactions: Reaction[] = [];
    constructor(masterService:MasterService)
    { super(100,100,12,12,12,0,0,0,0,0,0,0,0,0,[],[],masterService) }
    get name(): string {
        return 'test enemy';
    }
    IA_Action(ally: Character[], enemy: Character[]): battleActionOutput {
        const target = randomBetween(0,ally.length);
        switch (randomBetween(0,2))
        {
            //ATTACK
            case 0: return this.Attack([ally[target]]);
            //RANGE
            case 1: return this.Shoot([ally[target]]);
            //DEFEND
            case 2: return this.Defend([this]);
            default: return [[],[]];
        }
    }
    
}