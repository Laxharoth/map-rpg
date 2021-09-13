import { ActionOutput, storeable } from "src/app/customTypes/customTypes";
import { tag } from "src/app/customTypes/tags";
import { Character } from "../Character/Character";
import { MasterService } from "../masterService";

export abstract class Item implements storeable
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
  disabled(user: Character): boolean { return false;}
  abstract get isSingleTarget():boolean;
  itemEffect(user:Character,target: Character):ActionOutput { return target.react(this.tags,user) };
  get tags(): tag[] {return []};
  toJson():{[key: string]:any}
  {
    return {amount:this.amount}
  }
  fromJson(options: {[key: string]: any}): void
  {
    const {amount} = options;
    this.amount = amount;
  }
}
