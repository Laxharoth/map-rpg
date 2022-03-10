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
  action_source:Character,
  targets:Character[],
  items:BattleUseable[],
  game_state:game_state,
  action:(item:BattleUseable,target:Character[])=>void,
  is_valid_target:valid_target_function,
  is_item_disabled:is_item_disabled_function):Scene
{
  const options:(SceneOptions|DescriptableSceneOptions)[]=[]
  const returnOption = nextOption(masterService,'return')
  for(const item of items)
  {
    const option_targets = discriminate_targets(item,targets,is_valid_target)
    const option_action = (target: Character[])=>{ action(item,target); }
    options.push({
      text:item.name,
      action:()=>
      {
        if(item.isSingleTarget && option_targets.length>1)
        {
          masterService.sceneHandler
            .headScene(selectTarget(masterService,option_targets,option_action),game_state)
            .setScene(false)
          return;
        }
        option_action(option_targets);
      },
      get disabled(){return is_item_disabled(action_source,item)},
      descriptable: item
    })
  }
  const use_item_scene:Scene = {
    sceneData:()=>`${items.map(item=>item.name).join('\n')}`,
    options,fixed_options:[null,null,null,null,null]};
  use_item_scene.fixed_options[4] = returnOption;
  return use_item_scene
}
export function selectItemOverworld(masterService:MasterService):Scene
{
  const user = masterService.partyHandler.user;
  const party = masterService.partyHandler.party;
  const targets = [user].concat(party);
  const use_item_on_party = (item:GameItem,target:Character[])=>{
    const [scenes] = user.useItem(item,target).excecute();
    masterService.sceneHandler
      .tailScene(scenes,'item')
      .flush(scenes.length-1)
      .setScene(false);
  }
  const is_valid_target:valid_target_function=(item,target)=>{
    return (target===user && item.isSelfUsable)||(masterService.partyHandler.party.some((character:Character)=>character===target) && item.isPartyUsable)
  }
  const is_item_disabled:is_item_disabled_function = (action_source,item)=>!item.isMapUsable || item.disabled(action_source)
  const select_item_scene = selectItem(masterService,user,targets,user.inventory.items,'item',use_item_on_party,is_valid_target,is_item_disabled)
  select_item_scene.fixed_options[3]=drop_item(masterService,user)
  return select_item_scene;
}

function discriminate_targets(item:BattleUseable,targets:Character[],is_valid_target:valid_target_function):Character[]
{
  const valid_targets:Character[] = []
  for(const target of targets)
  {
    if(is_valid_target(item,target))valid_targets.push(target)
  }
  return valid_targets;
}

export type valid_target_function = (item:BattleUseable,target:Character)=>boolean
export type is_item_disabled_function = (character:Character,item:BattleUseable)=>boolean
