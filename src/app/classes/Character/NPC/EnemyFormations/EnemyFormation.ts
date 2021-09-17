import { Description, DescriptionOptions } from "src/app/classes/Descriptions/Description";
import { Item } from "src/app/classes/Items/Item";
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
    abstract loot():Item[];
    attemptEscape(party: Character[]):Description
    {
      if(!this.escapeCheck(party))return this.escapeFail();
      for(const character of party){character.onEndBattle();}
      this.masterService.gameStateHandler.gameState = 'map'
      this.masterService.descriptionHandler.flush(0);
      return this.escapeSuccess();
    }

    protected abstract escapeSuccess():Description;
    protected abstract escapeFail():Description;
    protected abstract escapeCheck(party: Character[]):boolean;
    protected exitOption(exitString:string):DescriptionOptions
    {
      return new DescriptionOptions(exitString,()=>{
        this.masterService.gameStateHandler.gameState = 'map';
        this.masterService.descriptionHandler.nextDescription(false);
      })
    }
}
