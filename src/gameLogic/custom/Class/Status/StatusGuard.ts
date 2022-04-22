import { MasterService } from 'src/app/service/master.service';
import { Reaction } from '../Character/Reaction/Reaction';
import { ReactionGuard } from "../Character/Reaction/ReactionGuard";
import { StatusBattle } from "./StatusBattle";

export class StatusGuard extends StatusBattle{
  private static REACTION_GUARD:ReactionGuard;
  protected DURATION: number=1;
  constructor(masterService:MasterService){
    super(masterService)
    if(!StatusGuard.REACTION_GUARD)StatusGuard.REACTION_GUARD=new ReactionGuard(masterService);
  }
  readonly type: "StatusGuard"="StatusGuard"
  get name(): string { return "status" }
  get description(): string {
    return "redirects actions from other party members"
  }
  get reactions(): Reaction[] {
      return [StatusGuard.REACTION_GUARD]
  }
}
