import { Description, DescriptionOptions } from "src/app/classes/Descriptions/Description";
import { MasterService } from "src/app/classes/masterService";
import { randomBetween } from "src/app/htmlHelper/htmlHelper.functions";
import { Character } from "../../Character";
import { enemyTest } from "../enemyTest";
import { EnemyFormation } from "./EnemyFormation";

export class testformation extends EnemyFormation
{
    constructor(masterService:MasterService)
    {
        super(masterService)
        this._enemies = Array.from(Array(randomBetween(1,3))).map(_=>new enemyTest(this.masterService))
    }

    protected _enemies: Character[];
    onEnemyVictory(party: Character[]): Description {
        return this.enemyVictory(party)
    }
    onPartyVictory(party: Character[]): Description {
        return this.partyVictory(party)
    }
    
    //////////////////////////
    // Enemy Victory
    //////////////////////////
    private enemyVictory(party: Character[]): Description {
        const options = [new DescriptionOptions('next',()=>{
            party.forEach(char=>{char.stats.hitpoints = char.originalstats.hitpoints})
            this.masterService.descriptionHandler.nextDescription(false) 
        })]
        return new Description(()=>`Enemy won`, options)
    }
    //////////////////////////
    // Party Victory
    //////////////////////////
    private partyVictory(party: Character[]): Description {
        const options = [new DescriptionOptions('next',()=>{
            party.forEach(char=>{char.stats.hitpoints = Math.min(char.stats.hitpoints+10,char.originalstats.hitpoints)})
            this.masterService.descriptionHandler.nextDescription(false) 
        })]
        return new Description(()=>`Party won`, options)
    }
}