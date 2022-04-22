import { MasterService } from 'src/app/service/master.service';
import { Character } from 'src/gameLogic/custom/Class/Character/Character';
import { drop_item, nextOption } from 'src/gameLogic/custom/Class/Scene/CommonOptions';
import { GameItem } from 'src/gameLogic/custom/Class/Items/Item';
import { game_state } from 'src/gameLogic/configurable/subservice/game-state.type';
import { BattleUseable } from '../Items/BattleUseable';
import { selectTarget } from './SceneSelectTarget';
import { DescriptableSceneOptions, Scene, SceneOptions } from './Scene';

export function selectItem(
  masterService:MasterService,
  actionSource:Character,
  targets:Character[],
  items:BattleUseable[],
  gameState:game_state,
  action:(item:BattleUseable,target:Character[])=>void,
  isValidTarget:valid_target_function,
  isItemDisabled:is_item_disabled_function
  ):Scene{
  const options:(SceneOptions|DescriptableSceneOptions)[]=[]
  const returnOption = nextOption(masterService,'return')
  for(const item of items)
  {
    const optionTargets = discriminateTargets(item,targets,isValidTarget)
    const optionAction = (target: Character[])=>{ action(item,target); }
    options.push({
      text:item.name,
      action:()=>{
        if(item.isSingleTarget && optionTargets.length>1){
          masterService.sceneHandler
            .headScene(selectTarget(masterService,optionTargets,optionAction),gameState)
            .setScene(false)
          return;
        }
        optionAction(optionTargets);
      },
      get disabled(){return isItemDisabled(actionSource,item)},
      descriptable: item
    })
  }
  const useItemScene:Scene = {
    sceneData:()=>`${ items.map(item=>item.name).join('\n') }`,
      options,fixedOptions:[null,null,null,null,null]
  };
  if(useItemScene.fixedOptions)
    useItemScene.fixedOptions[4] = returnOption;
  return useItemScene
}
export function selectItemOverworld(masterService:MasterService):Scene{
  const user = masterService.partyHandler.user;
  const party = masterService.partyHandler.party;
  const targets = [user].concat(party);
  const useItemOnParty = (item:GameItem,target:Character[])=>{
    const [scenes] = user.useItem(item,target).excecute();
    masterService.sceneHandler
      .tailScene(scenes,'item')
      .flush(scenes.length-1)
      .setScene(false);
  }
  const isValidTarget:valid_target_function=(item,target)=>{
    return  (target===user && item.isSelfUsable)||
            (masterService.partyHandler.party.some((character:Character)=>character===target) && item.isPartyUsable)
  }
  const isItemDisabled:is_item_disabled_function = (actionSource,item)=>{
    return!item.isMapUsable || item.disabled(actionSource)
  };
  const selectItemScene = selectItem(masterService,
    user,targets,
    user.inventory.items,'item',
    // @ts-ignore
    useItemOnParty,isValidTarget,isItemDisabled);
  if(selectItemScene.fixedOptions)
    selectItemScene.fixedOptions[3]=drop_item(masterService,user);
  return selectItemScene;
}

function discriminateTargets(item:BattleUseable,targets:Character[],isValidTarget:valid_target_function):Character[]{
  const validTargets:Character[] = []
  for(const target of targets){
    if(isValidTarget(item,target))validTargets.push(target)
  }
  return validTargets;
}
export type valid_target_function = (item:BattleUseable,target:Character)=>boolean
export type is_item_disabled_function = (character:Character,item:BattleUseable)=>boolean
