import { Character } from "../Character";
import { MasterService } from '../../masterService';
import { ActionOutput, storeable } from 'src/app/customTypes/customTypes';
import { tag } from 'src/app/customTypes/tags';
import { statusname } from '../../../customTypes/statusnames';
import { pushBattleActionOutput } from "src/app/htmlHelper/htmlHelper.functions";
import { Reaction } from "../Reaction/Reaction";
import { SpecialAttack } from "../../Items/SpecialAttack/SpecialAttack";

export abstract class Status implements storeable
{
  protected masterService:MasterService;
  constructor(masterService:MasterService){this.masterService=masterService;}
  //constant
  abstract get name(): statusname;
  abstract get description(): string;
  abstract get effectHasEnded():boolean;
  protected abstract effect(target: Character):ActionOutput
  applyEffect(target: Character):ActionOutput{
    const effect = this.effect(target);
    return pushBattleActionOutput(target.react(this.tags,target), effect);
  }
  canApply(target: Character):boolean{return target.hasStatus(this.name)===0;}
  onStatusGainded(target: Character):ActionOutput{ return target.react(this.tags.concat(['status gained']),target) };
  onStatusRemoved(target: Character)  :ActionOutput{ return target.react(this.tags.concat(['status ended']),target) };
  toString():string{return this.name;};
  get tags(): tag[]{ return []}
  get reactions(): Reaction[]{ return [];}
  get specials():SpecialAttack[]{ return [];}

  toJson():{[key: string]:any}{return {}};
  fromJson(options:{[key: string]: any}):void{};
}
