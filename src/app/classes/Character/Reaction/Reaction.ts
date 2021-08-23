import { battleActionOutput } from "src/app/customTypes/customTypes";
import { tag } from "src/app/customTypes/tags" 
import { Character } from "../Character";

export abstract class Reaction{
    protected abstract whatTriggers: tag[];
    protected abstract action(source:Character,target: Character):battleActionOutput;

    reaction(actionTags: tag[],source:Character,target:Character):battleActionOutput
    {
        if(actionTags.some(tag=>this.whatTriggers.includes(tag)))
        { return this.action(source,target); }
        return [[],[]]
    }
}