import { MasterService } from "src/app/service/master.service";
import { MAXOPTIONSNUMBERPERPAGE } from 'src/gameLogic/custom/customTypes/constants';
import { Character } from 'src/gameLogic/custom/Class/Character/Character';
import { Description, DescriptionOptions } from './Description';
export function selectItem(masterService:MasterService):Description
{
  const user = masterService.partyHandler.user;
  const party= masterService.partyHandler.party;
  const items = user.inventory;
  const options:DescriptionOptions[]=[]
  const returnOption = new DescriptionOptions('return',()=>{ masterService.descriptionHandler.nextDescription(false) });
  for(const item of items)
  {
    const playerAction = (target: Character[])=>{
      const [descriptions] = user.useItem(item,target).excecute();
      masterService.descriptionHandler
        .tailDescription(descriptions,'item')
        .flush(descriptions.length-1)
        .setDescription(false);
    };
    options.push(new DescriptionOptions(item.name,()=>
    {
      const targets = []
        .concat(item.isSelfUsable? [user]:[])
        .concat(item.isPartyUsable?party:[])
      if(item.isSingleTarget && targets.length>1)
      {
        masterService.descriptionHandler
          .headDescription(selectTarget(targets,playerAction),'item')
          .setDescription(false)
        return;
      }
      playerAction(targets);
    },item.isBattleUsableOnly || item.disabled(user))
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
