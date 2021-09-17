import { ActionOutput } from "src/app/customTypes/customTypes";
import { pushBattleActionOutput } from "src/app/htmlHelper/htmlHelper.functions";
import { Character } from "../Character/Character";
import { EnemyFormation } from "../Character/NPC/EnemyFormations/EnemyFormation";
import { Item } from "../Items/Item";
import { SpecialAttack } from "../Items/SpecialAttack/SpecialAttack";
import { MasterService } from "../masterService";
import { Description, DescriptionOptions } from "./Description";

export const descriptionBattle = (masterService:MasterService,enemy:EnemyFormation)=>{

  const user = masterService.partyHandler.user;
  const party = masterService.partyHandler.party;
  masterService.enemyHandler.enemyFormation  = enemy;
  [user].concat(party).forEach(character=>{character.specialAttacks.forEach(attacker=>{attacker.cooldown = 0})})

  let battleRoundString:string[] = [];
  let startRoundString:string[] = [];
  let battleRoundDescription:Description[] = [];
  let startRoundDescription:Description[] = [];

  masterService.gameStateHandler.gameState = 'battle'

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
    battleRoundString = [];
    startRoundDescription = [];
    battleRoundDescription = [];
    updateDisables:{
      const specials = user.specialAttacks;
      descriptionOptionSpecial.disabled = specials.length <= 0 || specials.every(item => item.disabled(user));
      descriptionOptionItem.disabled = user.inventary.length <= 0 || user.inventary.every(item => item.disabled(user));
    }

    for(  const character of  getPossibleTarget( [user].concat(party).concat(enemy.enemies) )  )
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
  function round(playerAction:(target:Character[])=>ActionOutput,playerTarget:Character[]):void
  {
    for(const character of attackOrder()){
      if(character.stats.hitpoints <= 0)
      {
        battleRoundString.push(`${character.name} can't move`);
        pushBattleActionOutput(character.onDefeated(),[battleRoundDescription,battleRoundString])
        continue;
      }
      if(character === user)
      { pushBattleActionOutput(playerAction(playerTarget),[battleRoundDescription,battleRoundString]); continue; }

      { pushBattleActionOutput(character.IA_Action([user].concat(party),enemy.enemies),[battleRoundDescription,battleRoundString]) }

      if(enemyIsDefended()){
        for(const enem of enemy.enemies)
        { pushBattleActionOutput(enem.onDefeated(),[battleRoundDescription,battleRoundString]); }
        break;
      }
      if(partyIsDefended()){
        for(const ally of [user].concat(party))
        { pushBattleActionOutput(ally.onDefeated(),[battleRoundDescription,battleRoundString]); };
        break;
      }
    }
    if(enemyIsDefended()){ battleRoundDescription.push(endBattle(true,battleRoundString))}
    else if(partyIsDefended()){ battleRoundDescription.push(endBattle(false,battleRoundString))}
    else { battleRoundDescription.push(roundMessage(battleRoundString))}

    masterService.descriptionHandler
      .flush(1)
      .headDescription(...battleRoundDescription)
      .setDescription(false);
  }

  const descriptionOptionAttack = new DescriptionOptions("Attack", () => {
    const targets = getPossibleTarget(enemy.enemies);
    const playerAction = (target) => user.Attack(target);
    if (targets.length === 1)
      round(playerAction, targets);

    else
      masterService.descriptionHandler
        .headDescription(selectTarget(targets, playerAction))
        .setDescription(false);
  });
  const descriptionOptionShoot = new DescriptionOptions("Shoot ", () => {
    const targets = getPossibleTarget(enemy.enemies);
    const playerAction = (target: Character[]) => user.Shoot(target);
    if (targets.length === 1)
      round(playerAction, targets);

    else
      masterService.descriptionHandler
        .headDescription(selectTarget(targets, playerAction))
        .setDescription(false);
  });
  const descriptionOptionSpecial = new DescriptionOptions("Special", () => {
    masterService.descriptionHandler
      .headDescription(selectItem(user.specialAttacks))
      .setDescription(false);
  });
  const descriptionOptionItem = new DescriptionOptions("Item", () => {
    masterService.descriptionHandler
      .headDescription(selectItem(user.inventary))
      .setDescription(false);
  });
  const descriptionOptionDefend = new DescriptionOptions("Defend", () => {
    const playerAction = (target: Character[]) => user.Defend(target);
    round(playerAction, [user]);
  });
  const descriptionOptionAuto = new DescriptionOptions("Auto", () => {
    round((target: Character[]) => user.IA_Action([user].concat(party), getPossibleTarget(enemy.enemies)), []);
  });
  const descriptionOptionEscape = new DescriptionOptions("Escape", () => {
    masterService.descriptionHandler
      .flush(1)
      .headDescription(enemy.attemptEscape([user].concat(party)))
      .setDescription(false);
  });
  const options = [
    descriptionOptionAttack,
    descriptionOptionShoot,
    descriptionOptionSpecial,
    descriptionOptionItem,
    null,
    descriptionOptionDefend,
    descriptionOptionAuto,
    null,
    null,
    descriptionOptionEscape,
  ]

  const playerParalizedOption = [
    new DescriptionOptions("Paralized",()=>{
      round((target: Character[])=>[[],[]],[])
    })
  ]
  ///////////////////////////////////////////////////////
  //SELECT TARGET
  ///////////////////////////////////////////////////////
  function selectTarget(targets:Character[],playerAction:(target:Character[])=>ActionOutput):Description
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
    for(const item of items)
    {
      const playerAction = (target: Character[])=>user.useItem(item,target);
      options.push(new DescriptionOptions(item.name,()=>{
          if(item.isSelfUsableOnly)
          {
            round(playerAction,[user])
            return;
          }
          const targets = []
            .concat(item.isPartyUsable? [user].concat(party):[])
            .concat(item.isEnemyUsable? getPossibleTarget(enemy.enemies):[])
          if(item.isSingleTarget)
          {
            if(targets.length===1)
            {
              round(playerAction,targets);
              return;
            }
            masterService.descriptionHandler
            .headDescription(selectTarget(targets,playerAction))
            .setDescription(false)
            return;
          }
          round(playerAction,targets);
        },!item.isBattleUsable || item.disabled(user))
      )
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
    const nextOption = new DescriptionOptions("next",startRound)
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
      masterService.gameStateHandler.gameState = 'map'
      if(playerWon)
      {
        user.healHitPoints(10);
        masterService.descriptionHandler
          .flush(0)
          .headDescription( enemy.onPartyVictory([user].concat(party)) )
          .nextDescription(false);
        for(const item of enemy.loot()){user.addItem(item);}
      }
      else
      {
        user.healHitPoints(user.originalstats.hitpoints);
        masterService.descriptionHandler
          .flush(0)
          .headDescription( enemy.onEnemyVictory([user].concat(party)) )
          .nextDescription(false);
      }
    })
    return new Description(()=>`${roundStrings.join("\n\n")}`,[nextOption]);
  }

  startRound();
}
