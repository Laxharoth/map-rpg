import { Scene } from "../Class/Scene/Scene";
import { SceneHandlerService } from "./scene-handler";

export class InfoPageToggler{
  private sceneHandler:SceneHandlerService;
  private toggled=false;
  private infoScene:Scene;
  constructor(sceneHandler:SceneHandlerService){
    this.sceneHandler = sceneHandler;
    this.infoScene={sceneData:()=>null,options:[],fixedOptions:[null,null,null,null,null]};
    // debug
    if(this.infoScene.fixedOptions)
      this.infoScene.fixedOptions[0]={
        text: "return",
        action:()=>this.toggle(),
        disabled:false,
      }
  }

  toggle(){
    this.toggled = !this.toggled;
    if(this.toggled){
      this.sceneHandler.headScene(this.infoScene,'info').setScene(false)
      return;
    }
    this.sceneHandler.nextScene(false)
  }
}
