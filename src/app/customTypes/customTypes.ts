import { Description } from "../classes/Descriptions/Description";
import { Room } from "../classes/maps/room";
import { MasterService } from "src/app/service/master.service";

export type roomFunction = (masterService:MasterService) => Room;
export interface inputObject {default: string , placeholder: string}
export interface damageTypes {heatdamage?: number; energydamage?:number; frostdamage?:number; slashdamage?: number; bluntdamage?:number; piercedamage?: number; poisondamage? : number;}
export type ActionOutput = [Description[],string[]];
export interface characterStats { hitpoints ?: number; energypoints ?: number;
                                gold?:number;
                                attack ?: number; aim?: number; defence ?: number; speed ?: number; evasion ?: number;
                                heatresistance?: number; energyresistance?:number; frostresistance?:number; slashresistance?: number; bluntresistance?:number; pierceresistance?: number; poisonresistance ?: number;}
export interface storeable {
  toJson():{[key: string]:any};
  fromJson(options:{[key: string]: any}):void;
}
