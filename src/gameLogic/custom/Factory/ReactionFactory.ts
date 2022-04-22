import { MasterService } from "src/app/service/master.service";
import { Reaction, ReactionOptions } from "../Class/Character/Reaction/Reaction";

/** Creates a reaction */
export function ReactionFactory(masterService:MasterService,options:ReactionOptions):Reaction{
  const reaction = new reactionSwitcher[options.type](masterService);
  reaction.fromJson(options);
  return reaction;
}
export const reactionSwitcher:{[key:string]:ReactionConstructor} = {}
export type ReactionConstructor = new (masterService:MasterService) =>Reaction;
