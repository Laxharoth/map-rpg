import { MasterService } from "src/app/service/master.service";
import { storeable } from 'src/gameLogic/core/Factory/Factory';
import { Character } from "src/gameLogic/custom/Class/Character/Character";
import { EnemyFormation } from "src/gameLogic/custom/Class/Character/NPC/EnemyFormations/EnemyFormation";
import { GameItem } from 'src/gameLogic/custom/Class/Items/Item';
import { Scene, SceneOptions } from 'src/gameLogic/custom/Class/Scene/Scene';
import { pushBattleActionOutput } from 'src/gameLogic/custom/functions/htmlHelper.functions';
import { BattleUseable } from '../Items/BattleUseable';
import { nextOption } from '../Scene/CommonOptions';
import { selectTarget } from '../Scene/SceneSelectTarget';
import { selectItem } from '../Scene/SceneUseItem';
import { getUndefeatedTarget } from './Battle.functions';
import { BattleCommand, DefeatedCommand, EmptyCommand } from './BattleCommand';
export class Battle implements storeable{
  player: Character;
  party: Character[];
  type="";
  enemyFormation: EnemyFormation;
  private masterService: MasterService;
  protected battleOptions: SceneOptions[];
  fistRound = true;
  protected battleRoundString: string[] = [];
  protected startRoundString: string[] = [];
  protected battleRoundScene: Scene[] = [];
  protected startRoundScene: Scene[] = [];

  constructor(masterService: MasterService, enemyFormation: EnemyFormation, postInitializeBattleOptions: ((battleOptions:SceneOptions[])=>void)|null=null) {
    this.player = masterService.partyHandler.user;
    this.party = masterService.partyHandler.party;
    this.enemyFormation = enemyFormation;
    masterService.partyHandler.enemyFormation = enemyFormation;
    this.masterService = masterService;
    [this.player].concat(this.party).forEach(character => {
      character.specialAttacks.forEach(special => {
        special.reset_initial_cooldown();
      })
    });
    this.battleOptions = this.initializeBattleOptions() as SceneOptions[];
    postInitializeBattleOptions?.(this.battleOptions);
  }
  start(): void {
    this.startRound();
  }
  /** Iterates the character actions appling their actions. */
  private round(playerAction: BattleCommand): void {
    const partyIsDefeated = () => { return getUndefeatedTarget([this.player].concat(this.party)).length === 0 }
    const turn_characters =getUndefeatedTarget([this.player].concat(this.party).concat(this.enemyFormation.enemies))
    const battle_commands:BattleCommand[] = []
    for (const character of turn_characters) {
      if (character === this.player) { battle_commands.push(playerAction); continue; }
      battle_commands.push(character.IA_Action())
    }
    for(let battle_command of sortBattleCommands(battle_commands)) {
      if(battle_command.source.isDefeated())battle_command=new DefeatedCommand(battle_command.source, battle_command.target);
      for(const character of turn_characters){
        pushBattleActionOutput(character.reactBefore(battle_command),[this.battleRoundScene, this.battleRoundString])
      }
      pushBattleActionOutput(battle_command.excecute(),[this.battleRoundScene, this.battleRoundString])
      for(const target of battle_command.target){
        pushBattleActionOutput(target.react(battle_command),[this.battleRoundScene, this.battleRoundString])
      }
      if (this.enemyFormation.IsDefeated) {
        for (const enem of this.enemyFormation.enemies)
          pushBattleActionOutput(enem.onDefeated(), [this.battleRoundScene, this.battleRoundString]);
        break;
      }
      if (partyIsDefeated()) {
        for (const ally of [this.player].concat(this.party))
          pushBattleActionOutput(ally.onDefeated(), [this.battleRoundScene, this.battleRoundString]);
        break;
      }
    }
    if (this.enemyFormation.IsDefeated) {
      for(const character of [this.player].concat(this.party).concat(this.enemyFormation.enemies))character.onEndBattle();
      this.battleRoundScene.push(this.endBattlePlayerWins())
    } else if (partyIsDefeated()) {
      for(const character of [this.player].concat(this.party).concat(this.enemyFormation.enemies))character.onEndBattle();
      this.battleRoundScene.push(this.endBattleEnemyWins())
    } else {
      this.battleRoundScene.push(this.roundMessage(this.battleRoundString))
    }
    this.masterService.sceneHandler
      .flush(0)
      .tailScene(this.battleRoundScene, 'battle')
      .nextScene(false);
  }

  private roundMessage(roundStrings: string[]): Scene {
    const nextOption = {text:"next", action:() => this.startRound(),disabled:false}
    return {sceneData: () => `${roundStrings.join("\n\n")}`, options:[nextOption],fixedOptions:[null,null,null,null,null]}
  }

  /** Reset the round strings and scenes lists. */
  private startRound(): void {
    this.startRoundString = [];
    this.battleRoundString = [];
    this.startRoundScene = [];
    this.battleRoundScene = [];
    const specials = this.player.specialAttacks;
    this.special_option.disabled = specials.length <= 0;
    this.item_option.disabled = this.player.inventory.items.length <= 0 || this.player.inventory.items.every(item => item.disabled(this.player));

    for (const character of getUndefeatedTarget([this.player].concat(this.party).concat(this.enemyFormation.enemies))) {
      const commands = character.startRound();
      for(const command of sortBattleCommands(commands)){
        const [reactScene,reactString] = character.reactBefore(command);
        const [scene,string] = command.excecute();
        this.startRoundScene.push(...reactScene,...scene);
        this.startRoundString.push(reactString.concat(string).join('\n'));
      }
    }
    this.startRoundScene.push({
      sceneData: () => `${this.startRoundString.join("\n\n")}`,
      options: this.player.hasTag('paralized') ? [this.playerParalizedOption] : this.battleOptions,
      fixedOptions: [null, null, null, null, null]
    });
    this.masterService.sceneHandler
      .tailScene(this.startRoundScene, 'battle')
    if (this.fistRound)
      this.masterService.sceneHandler
      .setScene(false);
    else
      this.masterService.sceneHandler
      .nextScene(false);
    this.fistRound = false;
  }

  /** Returns options to select target. */
  private selectTarget(targets: Character[], playerAction:BattleCommand): void {
    const selectTargetAction = (target:Character[]) => {
      playerAction.target = target;
      this.round(playerAction)
    }
    this.masterService.sceneHandler
      .headScene(
        selectTarget(this.masterService,targets,selectTargetAction),
        'battle'
      )
      .setScene(false);
  }
  /** Returns options to select an item */
  selectItem(items: BattleUseable[]): void {
    this.masterService.sceneHandler
      .headScene(this.useItemOnBattle(items), 'battle')
      .setScene(false);
  }
  private endBattlePlayerWins():Scene {
    this.masterService.partyHandler.battleEnded('victory')
    pushBattleActionOutput(this.enemyFormation.give_experience([this.player].concat(this.party)),[this.battleRoundScene, this.battleRoundString])
    const nextOption = {
      text:'next',
      action:() => {
      this.player.healHitPoints(10);
      this.masterService.sceneHandler
        .tailScene(this.enemyFormation.onPartyVictory([this.player].concat(this.party)), 'battle')
        .nextScene(false);
      for (const item of this.enemyFormation.loot()) {
        this.player.inventory.addItem(item);
      }
    }
    ,disabled:false}
    return { sceneData: () => `${this.battleRoundString.join("\n\n")}`,options: [nextOption],fixedOptions:[null,null,null,null,null]};
  }
  private endBattleEnemyWins():Scene {
    this.masterService.partyHandler.battleEnded('lost')
    const nextOption = {text:'next', action:() => {
      this.player.healHitPoints(this.player.calculatedStats.hitpoints);
      this.masterService.sceneHandler
        .tailScene(this.enemyFormation.onEnemyVictory([this.player].concat(this.party)), 'battle')
        .nextScene(false);
    },disabled:false}
    return {sceneData: () => `${this.battleRoundString.join("\n\n")}`, options: [nextOption],fixedOptions:[null,null,null,null,null]};
  }
  protected playerParalizedOption = {text:"Paralized", action:() => { this.round(new EmptyCommand(this.player,[])) },disabled:false}
  protected attack_option ={text: "Attack",action: () => {
    const targets = getUndefeatedTarget(this.enemyFormation.enemies);
    const playerAction = this.player.Attack(targets);
    if (targets.length === 1) return this.round(playerAction);
    this.selectTarget(targets, playerAction);
  },disabled:false};
  protected shoot_option ={text: "Shoot ", action:() => {
    const targets = getUndefeatedTarget(this.enemyFormation.enemies);
    const playerAction = this.player.Shoot(targets);
    if (targets.length === 1)return this.round(playerAction);
    this.selectTarget(targets, playerAction)
  },disabled:false};
  protected special_option={text:"Special", action:() => {
    this.selectItem([...this.player.specialAttacks]);
  },disabled:false};
  protected item_option = {text:"Item", action:() => {
    this.selectItem(this.player.inventory.items);
  },disabled:false};
  protected defend_option = {text:"Defend", action:() => {
    const playerAction = this.player.Defend([this.player]);
    this.round(playerAction);
  },disabled:false}
  protected auto_option ={text:"Auto", action:() => {
    this.round(this.player.IA_Action());
  },disabled:false};
  protected escape_option = {text:"Escape", action:() => {
    const [descriptionText, successfulEscaping] = this.enemyFormation.attemptEscape([this.player].concat(this.party))
    if (successfulEscaping) {
      this.masterService.partyHandler.battleEnded('escape')
      this.masterService.sceneHandler
        .flush(0)
        .tailScene({sceneData:()=>descriptionText, options:[nextOption(this.masterService)],fixedOptions:[null,null,null,null,null]}, 'battle')
        .nextScene(false);
      return;
    }
    //player will do nothing
    const playerAction= new EmptyCommand(this.player,[])
    this.startRoundScene.push({sceneData:()=>descriptionText, options:[nextOption(this.masterService)],fixedOptions:[null,null,null,null,null]})
    this.round(playerAction)
  },disabled:false};
  protected initializeBattleOptions(): (SceneOptions|null)[] {
    return [
      this.attack_option,
      this.shoot_option,
      this.special_option,
      this.item_option,
      null,
      null,
      null,
      this.defend_option,
      this.auto_option,
      null,
      null,
      null,
      null,
      this.escape_option,
    ]
  }
  /** TODO document method */
  private useItemOnBattle(items:BattleUseable[]):Scene{
    const useItemOnBattle = (item:GameItem,target:Character[])=>{
      const battle_action =  this.player.useItem(item,target);
      this.round(battle_action)
    }
    const isValidTarget = (item:GameItem,target:Character)=>{
      return (item.isPartyUsable&&this.party.includes(target))||
      (item.isEnemyUsable&&(this.enemyFormation.enemies as Character[]).includes(target))||
      (item.isSelfUsable&&this.player===(target))
    }
    const is_item_disabled = (character:Character,item:GameItem)=>!item.isBattleUsable||item.disabled(this.player)
    return selectItem(
      this.masterService,
      this.player,getUndefeatedTarget([this.player].concat(this.party).concat(this.enemyFormation.enemies)),
      items,
      'battle',
      // @ts-ignore
      useItemOnBattle,
      isValidTarget,
      is_item_disabled)
  }
  toJson():BattleOptions{
    throw new Error("Not implemented");
  }
  fromJson(options:BattleOptions){
    if(options.postInitializeBattleOptions)
      options.postInitializeBattleOptions(this.battleOptions);
  }
}

export interface BattleOptions{
  Factory:"Battle"
  type:string;
  enemy:EnemyFormation;
  postInitializeBattleOptions?:(battleOptions:SceneOptions[])=>void
}

function sortBattleCommands(commands:BattleCommand[]){
  return commands.sort( (command_1, command_2) => (command_1.priority || 0) > (command_2.priority || 0)  ||
    command_1.source.calculatedStats.initiative > command_2.source.calculatedStats.initiative
    ?1:-1
  )
}
