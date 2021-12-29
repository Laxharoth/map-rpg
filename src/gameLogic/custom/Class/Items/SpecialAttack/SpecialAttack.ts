import { MasterService } from "src/app/service/master.service";
import { Character } from "src/gameLogic/custom/Class/Character/Character";
import { specialsname } from "src/gameLogic/custom/Class/Items/Item.type";
import { tag } from "src/gameLogic/custom/customTypes/tags";
import { pushBattleActionOutput } from "src/gameLogic/custom/functions/htmlHelper.functions";
import { ActionOutput } from "../../Character/Character.type";
import { BattleUseable } from "../BattleUseable";

export abstract class SpecialAttack implements BattleUseable
{
  protected masterService:MasterService;
  /** the cooldown time*/
  protected abstract readonly COOLDOWN:number;
  /** The remaining turns to finish cooldown */
  cooldown: number = 0;
  abstract get isPartyUsable(): boolean;
  abstract get isEnemyUsable(): boolean;
  abstract get isSelfUsable(): boolean;
  abstract get isSingleTarget(): boolean;
  get isBattleUsable(): boolean { return true; }
  get isMapUsable(): boolean { return true; }
  abstract get description(): string;
  abstract get name():specialsname;
  get tags():tag[]{ return []}
  itemEffect(user: Character, targets: Character | Character[]): ActionOutput {
    const description :ActionOutput = [[],[]]
    if(!(targets instanceof Array))targets = [targets]
    this.cooldown = this.COOLDOWN;
    for(const target of targets)
    {
      pushBattleActionOutput(this._itemEffect(user,target),description);
      pushBattleActionOutput(target.react(this.tags,user),description);
    }
    return description;
  }
  protected abstract _itemEffect(user: Character, targets: Character): ActionOutput;
  disabled(user:Character): boolean { return this.cooldown > 0;}
  constructor(masterService:MasterService){this.masterService=masterService;}
}
