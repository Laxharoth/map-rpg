import { Scene } from "../Class/Scene/Scene";
import { SceneHandlerService } from "./scene-handler";

export class InfoPageToggler{
  private scene_handler:SceneHandlerService;
  private toggled=false;
  private info_scene:Scene;
  constructor(scene_handler:SceneHandlerService){
    this.scene_handler = scene_handler;
    this.info_scene={sceneData:()=>null,options:[],fixed_options:[null,null,null,null,null]};
    /** debug */ this.info_scene.fixed_options&&(this.info_scene.fixed_options[0]={
      text: "return",
      action:()=>this.toggle(),
      disabled:false,
    })
  }

  toggle(){
    this.toggled = !this.toggled;
    if(this.toggled)
    {
      this.scene_handler.headScene(this.info_scene,'info').setScene(false)
      return;
    }
    this.scene_handler.nextScene(false)
  }
}
