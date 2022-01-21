import { MasterService } from "src/app/service/master.service";
import { Reaction, ReactionOptions } from "../Class/Character/Reaction/Reaction";

export function ReactionFactory(masterService:MasterService,options:ReactionOptions):Reaction
{
  const reaction = new reaction_switcher[options.type](masterService);
  reaction.fromJson(options);
  return reaction;
}
export const reaction_switcher:{[key:string]:ReactionConstructor} = {}

export interface ReactionConstructor{ new (masterService:MasterService):Reaction; }
