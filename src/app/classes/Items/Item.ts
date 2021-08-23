import { battleActionOutput } from "src/app/customTypes/customTypes";
import { tag } from "src/app/customTypes/tags";
import { Character } from "../Character/Character";
import { MasterService } from "../masterService";

export abstract class Item
{
  readonly maxStack: number = 9;
  protected readonly masterService: MasterService;
  amount: number = 1;
  constructor(masterService:MasterService){this.masterService=masterService;}
  abstract get name(): string;
  abstract get isBattleUsable(): boolean;
  get isBattleUsableOnly(): boolean {return false;}
  abstract get isPartyUsable(): boolean;
  abstract get isEnemyUsable(): boolean;
  abstract get isSelfUsableOnly(): boolean;
  get disabled(): boolean { return false;}
  abstract get isSingleTarget():boolean;
  abstract itemEffect(user:Character,target: Character):battleActionOutput;
  get tags(): tag[] {return []};
}
