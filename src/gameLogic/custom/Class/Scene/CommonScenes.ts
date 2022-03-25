import { MasterService } from "src/app/service/master.service";
import { SceneSelectItemFromMap } from "./CommonOptions";
import { Scene } from "./Scene";

export function MapScene(masterService:MasterService,sceneString:(()=>string)|string):Scene{
  return {
    sceneData:() => (typeof sceneString === "function")?sceneString():sceneString,
    options:[],
    fixed_options:[SceneSelectItemFromMap(masterService),null,null,null,null]
  }
}
