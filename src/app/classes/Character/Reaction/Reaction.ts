import { ActionOutput } from "src/app/customTypes/customTypes";
import { tag } from "src/app/customTypes/tags" 
import { MasterService } from "../../masterService";
import { Character } from "../Character";

export abstract class Reaction{
    protected abstract whatTriggers: tag[][];
    protected abstract action(source:Character,target: Character):ActionOutput;
    protected masterService!:MasterService;

    constructor(masterService:MasterService)
    { this.masterService = masterService; }

    reaction(actionTags: tag[],source:Character,target:Character):ActionOutput
    {
        for( const trigger of this.whatTriggers )
        {
            if(trigger.every(tag=>actionTags.includes(tag)))
            { return this.action(source,target); }
        }
        return [[],[]]
    }
}