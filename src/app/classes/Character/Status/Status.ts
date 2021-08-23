import { DescriptionHandlerService } from './../../../service/description-handler.service';
import { Description } from "../../Descriptions/Description";
import { Character } from "../Character";
import { MasterService } from '../../masterService';
import { battleActionOutput } from 'src/app/customTypes/customTypes';
import { tag } from 'src/app/customTypes/tags';

export abstract class Status
{
  protected masterService:MasterService;
  constructor(masterService:MasterService){this.masterService=masterService;}
  //constant
  abstract get name(): string;
  abstract get description(): string;
  abstract applyEffect(target: Character):battleActionOutput
  abstract get effectHasEnded():boolean;
  protected abstract effect(target: Character):battleActionOutput

  canApply(target: Character):boolean{return target.hasStatus(this.name)===0;}
  onStatusGainded(target: Character):battleActionOutput{return [[],[]];};
  onEffectEnded(target: Character)  :battleActionOutput{return [[],[]];};
  toString():string{return this.name;};
  get tags(): tag[]{ return []}
}
