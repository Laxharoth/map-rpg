import { characterType } from "src/app/customTypes/characterTypes";
import { MasterService } from "../../masterService";
import { charTest } from "../NPC/characterTest";
import { enemyTest } from "../NPC/enemyTest";

export function CharacterFactory(masterService:MasterService,characterType:characterType,options:{[key: string]:any})
{
  const character = CharacterSwitcher[characterType](masterService)
  character.fromJson(options);
  return character;
}

const CharacterSwitcher = {
  'test character':(masterService:MasterService)=>new charTest(masterService,''),
  'test enemy':(masterService:MasterService)=>new enemyTest(masterService),
}
