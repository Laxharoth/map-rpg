import { Description } from "src/app/classes/Descriptions/Description";
import { MasterService } from "src/app/classes/masterService";
import { Character } from "../../Character";

export abstract class EnemyFormation
{
    protected abstract _enemies:Character[];
    protected readonly masterService: MasterService;

    constructor( masterService:MasterService){this.masterService =masterService;}
    get enemies():Character[] {return this._enemies;}

    abstract onEnemyVictory(party: Character[]):Description;
    abstract onPartyVictory(party: Character[]):Description;
}