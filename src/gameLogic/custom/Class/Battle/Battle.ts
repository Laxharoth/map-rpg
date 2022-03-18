import { pushBattleActionOutput } from 'src/gameLogic/custom/functions/htmlHelper.functions';
import { GameItem } from 'src/gameLogic/custom/Class/Items/Item';
import { Scene, SceneOptions} from 'src/gameLogic/custom/Class/Scene/Scene';
import { MasterService } from "src/app/service/master.service";
import { Character } from "src/gameLogic/custom/Class/Character/Character";
import { EnemyFormation } from "src/gameLogic/custom/Class/Character/NPC/EnemyFormations/EnemyFormation";
import { get_undefeated_target } from './Battle.functions';
import { nextOption } from '../Scene/CommonOptions';
import { BattleCommand, DefeatedCommand, EmptyCommand } from './BattleCommand';
import { selectItem } from '../Scene/SceneUseItem';
import { selectTarget } from '../Scene/SceneSelectTarget';
import { BattleUseable } from '../Items/BattleUseable';
export class Battle {
  player: Character;
  party: Character[];
  enemy_formation: EnemyFormation;
  private master_service: MasterService;
  protected battle_options: SceneOptions[];
  fistRound = true;
  protected battleRoundString: string[] = [];
  protected startRoundString: string[] = [];
  protected battleRoundScene: Scene[] = [];
  protected startRoundScene: Scene[] = [];

  constructor(master_service: MasterService, enemy_formation: EnemyFormation, post_initialize_battle_options: ((battle_options:SceneOptions[])=>void)|null=null) {
    this.player = master_service.partyHandler.user;
    this.party = master_service.partyHandler.party;
    this.enemy_formation = enemy_formation;
    master_service.partyHandler.enemyFormation = enemy_formation;
    this.master_service = master_service;
    [this.player].concat(this.party).forEach(character => {
      character.specialAttacks.forEach(special => {
        special.reset_initial_cooldown();
      })
    });
    // @ts-ignore
    this.battle_options = this.initialize_battle_options();
    post_initialize_battle_options?.(this.battle_options);
  }
  /** Iterates the character actions appling their actions. */
  round(playerAction: BattleCommand): void {
    const partyIsDefeated = () => { return get_undefeated_target([this.player].concat(this.party)).length === 0 }
    const turn_characters =get_undefeated_target([this.player].concat(this.party).concat(this.enemy_formation.enemies))
    const battle_commands:BattleCommand[] = []
    for (const character of turn_characters) {
      if (character === this.player) { battle_commands.push(playerAction); continue; }
      battle_commands.push(character.IA_Action())
    }
    for(let battle_command of sortBattleCommands(battle_commands)) {
      if(battle_command.source.is_defeated())battle_command=new DefeatedCommand(battle_command.source, battle_command.target);
      for(const character of turn_characters){
        pushBattleActionOutput(character.reactBefore(battle_command),[this.battleRoundScene, this.battleRoundString])
      }
      pushBattleActionOutput(battle_command.excecute(),[this.battleRoundScene, this.battleRoundString])
      for(const target of battle_command.target){
        pushBattleActionOutput(target.react(battle_command),[this.battleRoundScene, this.battleRoundString])
      }
      if (this.enemy_formation.IsDefeated) {
        for (const enem of this.enemy_formation.enemies)
          pushBattleActionOutput(enem.onDefeated(), [this.battleRoundScene, this.battleRoundString]);
        break;
      }
      if (partyIsDefeated()) {
        for (const ally of [this.player].concat(this.party))
          pushBattleActionOutput(ally.onDefeated(), [this.battleRoundScene, this.battleRoundString]);
        break;
      }
    }
    if (this.enemy_formation.IsDefeated) {
      for(const character of [this.player].concat(this.party).concat(this.enemy_formation.enemies))character.onEndBattle();
      this.battleRoundScene.push(this.endBattlePlayerWins())
    } else if (partyIsDefeated()) {
      for(const character of [this.player].concat(this.party).concat(this.enemy_formation.enemies))character.onEndBattle();
      this.battleRoundScene.push(this.endBattleEnemyWins())
    } else {
      this.battleRoundScene.push(this.roundMessage(this.battleRoundString))
    }
    this.master_service.sceneHandler
      .flush(0)
      .tailScene(this.battleRoundScene, 'battle')
      .nextScene(false);
  }

  roundMessage(roundStrings: string[]): Scene {
    const nextOption = {text:"next", action:() => this.startRound(),disabled:false}
    return {sceneData: () => `${roundStrings.join("\n\n")}`, options:[nextOption],fixed_options:[null,null,null,null,null]}
  }

  /** Reset the round strings and scenes lists. */
  startRound(): void {
    this.startRoundString = [];
    this.battleRoundString = [];
    this.startRoundScene = [];
    this.battleRoundScene = [];
    const specials = this.player.specialAttacks;
    this.special_option.disabled = specials.length <= 0;
    this.item_option.disabled = this.player.inventory.items.length <= 0 || this.player.inventory.items.every(item => item.disabled(this.player));

    for (const character of get_undefeated_target([this.player].concat(this.party).concat(this.enemy_formation.enemies))) {
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
      options: this.player.hasTag('paralized') ? [this.playerParalizedOption] : this.battle_options,
      fixed_options: [null, null, null, null, null]
    });
    this.master_service.sceneHandler
      .tailScene(this.startRoundScene, 'battle')
    if (this.fistRound)
      this.master_service.sceneHandler
      .setScene(false);
    else
      this.master_service.sceneHandler
      .nextScene(false);
    this.fistRound = false;
  }

  /** Returns options to select target. */
  private selectTarget(targets: Character[], playerAction:BattleCommand): void {
    const select_target_action = (target:Character[]) => {
      playerAction.target = target;
      this.round(playerAction)
    }
    this.master_service.sceneHandler
      .headScene(
        selectTarget(this.master_service,targets,select_target_action),
        'battle'
      )
      .setScene(false);
  }
  /** Returns options to select an item */
  selectItem(items: BattleUseable[]): void {
    this.master_service.sceneHandler
      .headScene(this.use_Item_on_battle(items), 'battle')
      .setScene(false);
  }
  private endBattlePlayerWins():Scene {
    this.master_service.partyHandler.battle_ended('victory')
    pushBattleActionOutput(this.enemy_formation.give_experience([this.player].concat(this.party)),[this.battleRoundScene, this.battleRoundString])
    const nextOption = {
      text:'next',
      action:() => {
      this.player.healHitPoints(10);
      this.master_service.sceneHandler
        .tailScene(this.enemy_formation.onPartyVictory([this.player].concat(this.party)), 'battle')
        .nextScene(false);
      for (const item of this.enemy_formation.loot()) {
        this.player.inventory.addItem(item);
      }
    }
    ,disabled:false}
    return { sceneData: () => `${this.battleRoundString.join("\n\n")}`,options: [nextOption],fixed_options:[null,null,null,null,null]};
  }
  private endBattleEnemyWins():Scene {
    this.master_service.partyHandler.battle_ended('lost')
    const nextOption = {text:'next', action:() => {
      this.player.healHitPoints(this.player.calculated_stats.hitpoints);
      this.master_service.sceneHandler
        .tailScene(this.enemy_formation.onEnemyVictory([this.player].concat(this.party)), 'battle')
        .nextScene(false);
    },disabled:false}
    return {sceneData: () => `${this.battleRoundString.join("\n\n")}`, options: [nextOption],fixed_options:[null,null,null,null,null]};
  }
  protected playerParalizedOption = {text:"Paralized", action:() => { this.round(new EmptyCommand(this.player,[])) },disabled:false}
  protected attack_option ={text: "Attack",action: () => {
    const targets = get_undefeated_target(this.enemy_formation.enemies);
    const playerAction = this.player.Attack(targets);
    if (targets.length === 1) return this.round(playerAction);
    this.selectTarget(targets, playerAction);
  },disabled:false};
  protected shoot_option ={text: "Shoot ", action:() => {
    const targets = get_undefeated_target(this.enemy_formation.enemies);
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
    const [descriptionText, successfulEscaping] = this.enemy_formation.attemptEscape([this.player].concat(this.party))
    if (successfulEscaping) {
      this.master_service.partyHandler.battle_ended('escape')
      this.master_service.sceneHandler
        .flush(0)
        .tailScene({sceneData: descriptionText, options:[nextOption(this.master_service)],fixed_options:[null,null,null,null,null]}, 'battle')
        .nextScene(false);
      return;
    }
    //player will do nothing
    const playerAction= new EmptyCommand(this.player,[])
    this.startRoundScene.push({sceneData:descriptionText, options:[nextOption(this.master_service)],fixed_options:[null,null,null,null,null]})
    this.round(playerAction)
  },disabled:false};
  protected initialize_battle_options(): (SceneOptions|null)[] {
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
  private use_Item_on_battle(items:BattleUseable[]):Scene
  {
    const use_item_on_battle = (item:GameItem,target:Character[])=>{
      const battle_action =  this.player.useItem(item,target);
      this.round(battle_action)
    }
    const is_valid_target = (item:GameItem,target:Character)=>{
      return (item.isPartyUsable&&this.party.includes(target))||
      (item.isEnemyUsable&&(this.enemy_formation.enemies as Character[]).includes(target))||
      (item.isSelfUsable&&this.player===(target))
    }
    const is_item_disabled = (character:Character,item:GameItem)=>!item.isBattleUsable||item.disabled(this.player)
    return selectItem(this.master_service,
      this.player,get_undefeated_target([this.player].concat(this.party).concat(this.enemy_formation.enemies)),
      items,
      'battle',
      // @ts-ignore
      use_item_on_battle,
      is_valid_target,
      is_item_disabled)
  }
}

function sortBattleCommands(commands:BattleCommand[]){
  return commands.sort( (command_1, command_2) => (command_1.priority || 0) > (command_2.priority || 0)  ||
    command_1.source.calculated_stats.initiative > command_2.source.calculated_stats.initiative
    ?1:-1
  )
}
