import { Description, DescriptionOptions } from "src/app/classes/Descriptions/Description";
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
    attemptEscape(party: Character[]):Description
    {
      if(this.escapeCheck(party))
      {
        for(const character of party){character.onEndBattle();}
        return this.escapeSuccess();
      }
      return this.escapeFail();
    }

    protected abstract escapeSuccess():Description;
    protected abstract escapeFail():Description;
    protected abstract escapeCheck(party: Character[]):boolean;
    protected exitOption(exitString:string):DescriptionOptions {return new DescriptionOptions(exitString,()=>{ this.masterService.descriptionHandler.flush(0).setDescription(false)})}
}
