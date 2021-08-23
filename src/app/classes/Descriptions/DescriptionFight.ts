import { battleActionOutput } from "src/app/customTypes/customTypes";
import { pushBattleActionOutput } from "src/app/htmlHelper/htmlHelper.functions";
import { Character } from "../Character/Character";
import { EnemyFormation } from "../Character/NPC/EnemyFormations/EnemyFormation";
import { Item } from "../Items/Item";
import { MasterService } from "../masterService";
import { Description, DescriptionOptions } from "./Description";

export const descriptionFight = (masterService:MasterService,enemy:EnemyFormation)=>{

  const user = masterService.user;
  const party = masterService.party;
  [user].concat(party).forEach(character=>{character.specialAttacks.forEach(attacker=>{attacker.cooldown = 0})})

  let fightRoundString:string[] = [];
  let startRoundString:string[] = [];
  let fightRoundDescription:Description[] = [];
  let startRoundDescription:Description[] = [];

  function enemyIsDefended():boolean 
  { return enemy.enemies.every(character=>character.stats.hitpoints<=0); }
  function partyIsDefended():boolean
  { return user.stats.hitpoints<=0; }
  function getPossibleTarget(group:Character[]):Character[]
  { return group.filter(character => character.stats.hitpoints>0); }
  function attackOrder():Character[] {
    return [user]
          .concat(party.filter((character) => character.stats.hitpoints>0))
          .concat(enemy.enemies.filter((character) => character.stats.hitpoints>0))
          .sort((character,other)=> character.stats.speed > other.stats.speed ? -1:1)
  }
  function startRound():void
  {
    startRoundString = [];
    fightRoundString = [];
    startRoundDescription = [];
    fightRoundDescription = [];
    
    for(const character of  [user].concat(party).concat(enemy.enemies).filter(character => character.stats.hitpoints>0))
    {
      const [description,string] = character.startRound();
      startRoundDescription.push(...description)
      startRoundString.push(...string)
    }
    startRoundDescription.push(new Description(()=>`${startRoundString.join("\n\n")}`, user.hasTag('paralized')?playerParalizedOption:options));
    masterService.descriptionHandler
      .flush(0)
      .headDescription(...startRoundDescription)
      .setDescription(false);
  }
  function round(playerAction:(target:Character[])=>battleActionOutput,playerTarget:Character[]):void
  {
    for(const character of attackOrder()){
      if(character.hasTag('paralized') || character.stats.hitpoints <= 0)
      { fightRoundString.push(`${character.name} can't move`); continue; }
      if(character === user)
      { pushBattleActionOutput(playerAction(playerTarget),[fightRoundDescription,fightRoundString]); continue; }
      
      { pushBattleActionOutput(character.IA_Action([user].concat(party),enemy.enemies),[fightRoundDescription,fightRoundString]) }

      if(enemyIsDefended()){fightRoundString.push('ememy is defeated');break; }
      if(partyIsDefended()){fightRoundString.push('party is defeated');break;}
    }
    if(enemyIsDefended()){ fightRoundDescription.push(endBattle(true,fightRoundString))}
    else if(partyIsDefended()){ fightRoundDescription.push(endBattle(false,fightRoundString))}
    else { fightRoundDescription.push(roundMessage(fightRoundString))}

    masterService.descriptionHandler
      .flush(1)
      .headDescription(...fightRoundDescription)
      .setDescription(false);
  }

  const options = [
    new DescriptionOptions("Attack" ,()=>{
      const targets = getPossibleTarget(enemy.enemies);
      const playerAction = (target)=>user.Attack(target)
      if(targets.length === 1)
        round(playerAction,targets)
      else
        masterService.descriptionHandler
        .headDescription(selectTarget(targets,playerAction))
        .setDescription(false)
    }),
    new DescriptionOptions("Shoot " ,()=>{
      const targets = getPossibleTarget(enemy.enemies);
      const playerAction = (target: Character[])=>user.Shoot(target)
      if(targets.length === 1)
        round(playerAction,targets)
      else
      masterService.descriptionHandler
      .headDescription(selectTarget(targets,playerAction))
      .setDescription(false)
    }),
    new DescriptionOptions("Special",()=>{
      masterService.descriptionHandler
        .headDescription(selectItem(user.specialAttacks))
        .setDescription(false)
    },user.specialAttacks.length<=0),
    new DescriptionOptions("Item"   ,()=>{
      masterService.descriptionHandler
        .headDescription(selectItem(user.inventary))
        .setDescription(false)
    },user.inventary.length<=0),
    null,
    new DescriptionOptions("Defend",()=>{
      const playerAction = (target: Character[])=>user.Defend(target)
      round(playerAction,[user]);
    }),
    new DescriptionOptions("Auto",()=>{
      round((target: Character[])=>user.IA_Action([user].concat(party),enemy.enemies),[])
    }),
    null,
    null,
    new DescriptionOptions("Escape",()=>{
      masterService.descriptionHandler
        .flush(0)
        .headDescription(escapeMessage())
        .setDescription(false);
    }),
  ]

  const playerParalizedOption = [
    new DescriptionOptions("Paralized",()=>{
      round((target: Character[])=>[[],[]],[])
    })
  ]
  ///////////////////////////////////////////////////////
  //SELECT TARGET
  ///////////////////////////////////////////////////////
  function selectTarget(targets:Character[],playerAction:(target:Character[])=>battleActionOutput):Description
  {
    const targetsOptions:DescriptionOptions[] = [];
    for(const target of targets)
    {
      targetsOptions.push(new DescriptionOptions(target.name,()=>{ round(playerAction,[target]) }))
    }
    if(targetsOptions.length <= 10)
    {
      while(targetsOptions.length < 9) targetsOptions.push(null);
      targetsOptions.push(new DescriptionOptions('return',()=>{ masterService.descriptionHandler.nextDescription(false) }))
    }
    else
    {
      while(targetsOptions.length%8 !==7 ) targetsOptions.push(null);
      targetsOptions.push(new DescriptionOptions('return',()=>{ masterService.descriptionHandler.nextDescription(false) }))
    }
    return new Description(()=>`${targets.map(target=>`${target.name}:${target.stats.hitpoints}`).join('\n')}`,targetsOptions)
  }
  
  ///////////////////////////////////////////////////////
  //SELECT ITEM
  ///////////////////////////////////////////////////////
  function selectItem(items:Item[]):Description
  {
    const options:DescriptionOptions[]=[]

    for(let i = 0; i < items.length; i++)
    {
      const playerAction = (target: Character[])=>user.useSpecialAttack(i,target);
      options.push(new DescriptionOptions(items[i].name,()=>{
        console.log(items[i])
        if(items[i].isSelfUsableOnly)
        {
          round(playerAction,[user])
          return;
        }
        const targets = []
          .concat(items[i].isPartyUsable? [user].concat(party):[])
          .concat(items[i].isEnemyUsable? enemy.enemies:[])
        if(items[i].isSingleTarget)
        {
          masterService.descriptionHandler
          .headDescription(selectTarget(targets,playerAction))
          .setDescription(false)
          return;
        }
        round(playerAction,targets);
      },!items[i].isBattleUsable || items[i].disabled))
    }
    if(options.length <= 10)
    {
      while(options.length < 9) options.push(null);
      options.push(new DescriptionOptions('return',()=>{ masterService.descriptionHandler.nextDescription(false) }))
    }
    else
    {
      while(options.length%8 !==7 ) options.push(null);
      options.push(new DescriptionOptions('return',()=>{ masterService.descriptionHandler.nextDescription(false) }))
    }
    return new Description(()=>`${items.map(item=>item.name).join('\n')}`,options)
  }
  ///////////////////////////////////////////////////////
  //ROUND MESSAGE
  ///////////////////////////////////////////////////////
  function roundMessage(roundStrings:string[]):Description
  {
    const nextOption = new DescriptionOptions("next",function(){ startRound() })
    return new Description(()=>`${roundStrings.join("\n\n")}`,[nextOption])
  }

  ///////////////////////////////////////////////////////
  //ESCAPE MESSAGE
  ///////////////////////////////////////////////////////
  function escapeMessage():Description
  {
    const nextOption = new DescriptionOptions("next",function(){ masterService.descriptionHandler.nextDescription(false) })
    return new Description(()=>`${user.name} escapes`,[nextOption])
  }

  ///////////////////////////////////////////////////////
  //END BATTLE
  ///////////////////////////////////////////////////////
  function endBattle(playerWon: boolean,roundStrings:string[]):Description
  {
    const nextOption = new DescriptionOptions('next',()=>{
      if(!playerWon)user.stats.hitpoints=user.originalstats.hitpoints;
      else user.stats.hitpoints+=10;
      masterService.descriptionHandler.flush(0)
      masterService.descriptionHandler.headDescription(playerWon?
        enemy.onPartyVictory([user].concat(party)):
        enemy.onEnemyVictory([user].concat(party))
        ).setDescription(false);
    })
    return new Description(()=>`${roundStrings.join("\n\n")}`,[nextOption]);
  }

  startRound();
}
