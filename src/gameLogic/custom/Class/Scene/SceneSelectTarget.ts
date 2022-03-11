import { MasterService } from "src/app/service/master.service";
import { MAXOPTIONSNUMBERPERPAGE } from "../../customTypes/constants";
import { Character } from "../Character/Character";
import { nextOption } from "./CommonOptions";
import { Scene, SceneOptions } from "./Scene";

/** Returns options to select target. */
 export function selectTarget(masterService:MasterService,targets:Character[],playerAction:(target:Character[])=>void):Scene
 {
   const targetsOptions:SceneOptions[] = [];
   const returnOption = nextOption(masterService,'return');
   for(const target of targets)
   {
     targetsOptions.push({text:target.name,action:()=>{ playerAction([target]) },disabled:false})
   }
   if(targetsOptions.length <= MAXOPTIONSNUMBERPERPAGE)
   {
     while(targetsOptions.length < MAXOPTIONSNUMBERPERPAGE-1) targetsOptions.push(null);
     targetsOptions.push(returnOption)
   }
   else
   {
     while(targetsOptions.length%MAXOPTIONSNUMBERPERPAGE-2 !==MAXOPTIONSNUMBERPERPAGE-3) targetsOptions.push(null);
     targetsOptions.push(returnOption)
   }
   return {
     sceneData:()=>`${targets.map(target=>`${target.name}:${target.current_energy_stats.hitpoints}`).join('\n')}`,
     options:targetsOptions,fixed_options:[null,null,null,null,null]}
 }
