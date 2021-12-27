import { MasterService } from 'src/app/service/master.service';
import { Character } from 'src/gameLogic/custom/Class/Character/Character';
import { nextOption } from 'src/gameLogic/custom/Class/Descriptions/CommonOptions';
import { Description, DescriptionOptions } from 'src/gameLogic/custom/Class/Descriptions/Description';
import { GameItem } from 'src/gameLogic/custom/Class/Items/Item';
import { MAXOPTIONSNUMBERPERPAGE } from 'src/gameLogic/custom/customTypes/constants';
import { game_state } from 'src/gameLogic/custom/subservice/game-state.type';
import { selectTarget } from './DescriptionSelectTarget';

export function selectItem(
  masterService:MasterService,
  action_source:Character,
  targets:Character[],
  items:GameItem[],
  game_state:game_state,
  action:(item:GameItem,target:Character[])=>void,
  is_valid_target:valid_target_function,
  is_item_disabled:is_item_disabled_function):Description
{
  const options:DescriptionOptions[]=[]
  const returnOption = nextOption(masterService,'return')
  for(const item of items)
  {
    const option_targets = discriminate_targets(item,targets,is_valid_target)
    const option_action = (target: Character[])=>{ action(item,target); }
    options.push(new DescriptionOptions(item.name,()=>
    {
      if(item.isSingleTarget && option_targets.length>1)
      {
        masterService.descriptionHandler
          .headDescription(selectTarget(masterService,option_targets,option_action),game_state)
          .setDescription(false)
        return;
      }
      option_action(option_targets);
    },is_item_disabled(action_source,item))
    )
  }
  if(options.length <= MAXOPTIONSNUMBERPERPAGE)
  {
    while(options.length < MAXOPTIONSNUMBERPERPAGE-1) options.push(null);
    options.push(returnOption)
  }
  else
  {
    while(options.length%MAXOPTIONSNUMBERPERPAGE-2 !==MAXOPTIONSNUMBERPERPAGE-3 ) options.push(null);
    options.push(returnOption)
  }
  return new Description(()=>`${items.map(item=>item.name).join('\n')}`,options)
}
export function selectItemOverworld(masterService:MasterService):Description
{
  const user = masterService.partyHandler.user;
  const party = masterService.partyHandler.party;
  const targets = [user].concat(party);
  const use_item_on_party = (item:GameItem,target:Character[])=>{
    const [descriptions] = user.useItem(item,target).excecute();
    masterService.descriptionHandler
      .tailDescription(descriptions,'item')
      .flush(descriptions.length-1)
      .setDescription(false);
  }
  const is_valid_target:valid_target_function=(item,target)=>{
    return (target===user && item.isSelfUsable)||(masterService.partyHandler.party.some((character:Character)=>character===target) && item.isPartyUsable)
  }
  const is_item_disabled:is_item_disabled_function = (action_source,item)=>item.isBattleUsableOnly || item.disabled(action_source)
  return selectItem(masterService,user,targets,user.inventory,'item',use_item_on_party,is_valid_target,is_item_disabled)
}

function discriminate_targets(item:GameItem,targets:Character[],is_valid_target:valid_target_function):Character[]
{
  const valid_targets:Character[] = []
  for(const target of targets)
  {
    if(is_valid_target(item,target))valid_targets.push(target)
  }
  return valid_targets;
}

export type valid_target_function = (item:GameItem,target:Character)=>boolean
export type is_item_disabled_function = (character:Character,item:GameItem)=>boolean
