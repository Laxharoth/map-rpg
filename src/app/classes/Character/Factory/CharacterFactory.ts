import { characterType, CharacterTypeValues } from "src/app/customTypes/characterTypes";
import { MasterService } from "../../masterService";
import { charTest } from "../NPC/characterTest";
import { enemyTest } from "../NPC/enemyTest";
import { JohnSmith } from "../NPC/JohnSmit";

export function CharacterFactory(masterService:MasterService,characterType:characterType,options:{[key: string]:any})
{
  const character = CharacterSwitcher[characterType](masterService)
  character.fromJson(options);
  return character;
}

const CharacterSwitcher:{[key in CharacterTypeValues]:any} = {
  'test character':(masterService:MasterService)=>new charTest(masterService,''),
  'test enemy':(masterService:MasterService)=>new enemyTest(masterService),
  'john':(masterService:MasterService)=>new JohnSmith(masterService),
}
