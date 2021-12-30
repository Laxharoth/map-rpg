import { MasterService } from 'src/app/service/master.service';
import { Character } from 'src/gameLogic/custom/Class/Character/Character';
import { drop_item, nextOption } from 'src/gameLogic/custom/Class/Descriptions/CommonOptions';
import { DescriptableDescriptionOptions, Description, DescriptionOptions } from 'src/gameLogic/custom/Class/Descriptions/Description';
import { GameItem } from 'src/gameLogic/custom/Class/Items/Item';
import { game_state } from 'src/gameLogic/custom/subservice/game-state.type';
import { BattleUseable } from '../Items/BattleUseable';
import { selectTarget } from './DescriptionSelectTarget';

export function selectItem(
  masterService:MasterService,
  action_source:Character,
  targets:Character[],
  items:BattleUseable[],
  game_state:game_state,
  action:(item:BattleUseable,target:Character[])=>void,
  is_valid_target:valid_target_function,
  is_item_disabled:is_item_disabled_function):Description
{
  const options:DescriptionOptions[]=[]
  const returnOption = nextOption(masterService,'return')
  for(const item of items)
  {
    const option_targets = discriminate_targets(item,targets,is_valid_target)
    const option_action = (target: Character[])=>{ action(item,target); }
    options.push(new DescriptableDescriptionOptions(item.name,item,()=>
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
  const use_item_description = new Description(()=>`${items.map(item=>item.name).join('\n')}`,options);
  use_item_description.fixed_options[4] = returnOption;
  return use_item_description
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
  const is_item_disabled:is_item_disabled_function = (action_source,item)=>!item.isMapUsable || item.disabled(action_source)
  return selectItem(masterService,user,targets,user.inventory,'item',use_item_on_party,is_valid_target,is_item_disabled)
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
