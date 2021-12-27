import { pushBattleActionOutput } from 'src/gameLogic/custom/functions/htmlHelper.functions';
import { GameItem } from 'src/gameLogic/custom/Class/Items/Item';
import { Description } from 'src/gameLogic/custom/Class/Descriptions/Description';
import { MAXOPTIONSNUMBERPERPAGE } from 'src/gameLogic/custom/customTypes/constants';
import { DescriptionOptions } from 'src/gameLogic/custom/Class/Descriptions/Description';
import { MasterService } from "src/app/service/master.service";
import { Character } from "src/gameLogic/custom/Class/Character/Character";
import { EnemyFormation } from "src/gameLogic/custom/Class/Character/NPC/EnemyFormations/EnemyFormation";
import { attack_order, get_undefeated_target } from './Battle.functions';
import { nextOption } from '../Descriptions/CommonOptions';
import { BattleCommand, EmptyCommand } from './BattleCommand';
import { selectTarget } from '../Descriptions/DescriptionSelectTarget';
export class Battle {
  player: Character;
  party: Character[];
  enemy_formation: EnemyFormation;
  private master_service: MasterService;
  protected battle_options: DescriptionOptions[];
  fistRound = true;
  protected battleRoundString: string[] = [];
  protected startRoundString: string[] = [];
  protected battleRoundDescription: Description[] = [];
  protected startRoundDescription: Description[] = [];

  /**
   *
   * @param master_service The MasterService
   * @param enemy_formation The EnemyFormation
   * @param initialize_battle_options Sets up the battle options (should not be an arrow function)
   */
  constructor(master_service: MasterService, enemy_formation: EnemyFormation, post_initialize_battle_options: (battle_options:DescriptionOptions[])=>void=null) {
    this.player = master_service.partyHandler.user;
    this.party = master_service.partyHandler.party;
    this.enemy_formation = enemy_formation;
    master_service.enemyHandler.enemyFormation = enemy_formation;
    this.master_service = master_service;
    [this.player].concat(this.party).forEach(character => {
      character.specialAttacks.forEach(attacker => {
        attacker.cooldown = 0
      })
    });
    this.battle_options = this.initialize_battle_options();
    post_initialize_battle_options?.(this.battle_options);
  }
  /**
   * Iterates the character actions appling their actions.
   *
   * @param {(target:Character[])=>ActionOutput} playerAction
   * @param {Character[]} playerTarget
   */
  round(playerAction: BattleCommand): void {
    const partyIsDefeated = () => { return get_undefeated_target([this.player].concat(this.party)).length === 0 }
    const turn_characters = attack_order(get_undefeated_target([this.player].concat(this.party).concat(this.enemy_formation.enemies)))
    const battle_commands:BattleCommand[] = []
    for (const character of turn_characters) {
      //check if was defeated this round
      if (character.current_energy_stats.hitpoints <= 0) {
        pushBattleActionOutput(character.onDefeated(), [this.battleRoundDescription, this.battleRoundString])
        continue;
      }
      if (character === this.player) {
        battle_commands.push(playerAction)
        continue;
      }
      battle_commands.push(character.IA_Action())
    }
    for(const battle_command of battle_commands) {
      turn_characters.forEach(character=>pushBattleActionOutput([this.battleRoundDescription, this.battleRoundString],character.battle_command_react(battle_command)))
      pushBattleActionOutput([this.battleRoundDescription, this.battleRoundString],battle_command.excecute())
      if (this.enemy_formation.IsDefeated) {
        for (const enem of this.enemy_formation.enemies)
          pushBattleActionOutput(enem.onDefeated(), [this.battleRoundDescription, this.battleRoundString]);
        break;
      }
      if (partyIsDefeated()) {
        for (const ally of [this.player].concat(this.party))
          pushBattleActionOutput(ally.onDefeated(), [this.battleRoundDescription, this.battleRoundString]);
        break;
      }
    }
    if (this.enemy_formation.IsDefeated) {
      for(const character of [this.player].concat(this.party).concat(this.enemy_formation.enemies))character.onEndBattle();
      this.battleRoundDescription.push(this.endBattlePlayerWins())
    } else if (partyIsDefeated()) {
      for(const character of [this.player].concat(this.party).concat(this.enemy_formation.enemies))character.onEndBattle();
      this.battleRoundDescription.push(this.endBattleEnemyWins())
    } else {
      this.battleRoundDescription.push(this.roundMessage(this.battleRoundString))
    }

    this.master_service.descriptionHandler
      .flush(0)
      .tailDescription(this.battleRoundDescription, 'battle')
      .nextDescription(false);
  }

  roundMessage(roundStrings: string[]): Description {
    const nextOption = new DescriptionOptions("next", () => this.startRound())
    return new Description(() => `${roundStrings.join("\n\n")}`, [nextOption])
  }

  /**
   * Reset the round strings and description lists.
   */
  startRound(): void {
    this.startRoundString = [];
    this.battleRoundString = [];
    this.startRoundDescription = [];
    this.battleRoundDescription = [];
    const specials = this.player.specialAttacks;
    this.special_option.disabled = specials.length <= 0 || specials.every(item => item.disabled(this.player));
    this.item_option.disabled = this.player.inventory.length <= 0 || this.player.inventory.every(item => item.disabled(this.player));

    for (const character of get_undefeated_target([this.player].concat(this.party).concat(this.enemy_formation.enemies))) {
      const [description, string] = character.startRound();
      this.startRoundDescription.push(...description);
      this.startRoundString.push(string.join('\n'));
    }
    this.startRoundDescription.push(new Description(() => `${this.startRoundString.join("\n\n")}`, this.player.hasTag('paralized') ? [this.playerParalizedOption] : this.battle_options));
    this.master_service.descriptionHandler
      .tailDescription(this.startRoundDescription, 'battle')
    if (this.fistRound)
      this.master_service.descriptionHandler
      .setDescription(false);
    else
      this.master_service.descriptionHandler
      .nextDescription(false);
    this.fistRound = false;
  }

  /**
   * Returns options to select target.
   *
   * @param {Character[]} targets
   * @param {(target:Character[])=>ActionOutput} playerAction
   * @return {*}  {Description}
   */
  private selectTarget(targets: Character[], playerAction:BattleCommand): void {
    const select_target_action = (target:Character[]) => {
      playerAction.target = target;
      this.round(playerAction)
    }
    this.master_service.descriptionHandler
      .headDescription(
        selectTarget(this.master_service,targets,select_target_action),
        'battle'
      )
      .setDescription(false);
  }
  /**
   * Returns options to select an item
   *
   * @param {GameItem[]} items
   * @return {*}  {Description}
   */
  selectItem(items: GameItem[]): void {
    const options: DescriptionOptions[] = []
    for (const item of items) {
      options.push(new DescriptionOptions(item.name, () => {
        const targets = []
          .concat(item.isSelfUsable ? [this.player] : [])
          .concat(item.isPartyUsable ? get_undefeated_target(this.party) : [])
          .concat(item.isEnemyUsable ? get_undefeated_target(this.enemy_formation.enemies) : [])
        const playerAction = this.player.useItem(item, targets);
        if (item.isSingleTarget && targets.length > 1) {
          return this.selectTarget(targets, playerAction)
        }
        this.round(playerAction);
      }, !item.isBattleUsable || item.disabled(this.player)))
    }
    if (options.length <= MAXOPTIONSNUMBERPERPAGE) {
      while (options.length < MAXOPTIONSNUMBERPERPAGE - 1) options.push(null);
      options.push(new DescriptionOptions('return', () => {
        this.master_service.descriptionHandler.nextDescription(false)
      }))
    } else {
      while (options.length % MAXOPTIONSNUMBERPERPAGE - 2 !== MAXOPTIONSNUMBERPERPAGE - 3) options.push(null);
      options.push(new DescriptionOptions('return', () => {
        this.master_service.descriptionHandler.nextDescription(false)
      }))
    }
    this.master_service.descriptionHandler
      .headDescription(new Description(() => `${items.map(item=>item.name).join('\n')}`, options), 'battle')
      .setDescription(false);
  }
  private endBattlePlayerWins() {
    const nextOption = new DescriptionOptions('next', () => {
      this.player.healHitPoints(10);
      this.player.gain_experience(20);
      this.master_service.descriptionHandler
        .tailDescription(this.enemy_formation.onPartyVictory([this.player].concat(this.party)), 'battle')
        .nextDescription(false);
      for (const item of this.enemy_formation.loot()) {
        this.player.addItem(item);
      }
    })
    return new Description(() => `${this.battleRoundString.join("\n\n")}`, [nextOption]);
  }
  private endBattleEnemyWins() {
    const nextOption = new DescriptionOptions('next', () => {
      this.player.healHitPoints(this.player.energy_stats.hitpoints);
      this.master_service.descriptionHandler
        .tailDescription(this.enemy_formation.onEnemyVictory([this.player].concat(this.party)), 'battle')
        .nextDescription(false);
    })
    return new Description(() => `${this.battleRoundString.join("\n\n")}`, [nextOption]);
  }
  protected playerParalizedOption = new DescriptionOptions("Paralized", () => {
    this.round(new EmptyCommand(this.player,[]))
  })
  protected attack_option = new DescriptionOptions("Attack", () => {
    const targets = get_undefeated_target(this.enemy_formation.enemies);
    const playerAction = this.player.Attack(targets);
    if (targets.length === 1) return this.round(playerAction);
    this.selectTarget(targets, playerAction);
  });
  protected shoot_option = new DescriptionOptions("Shoot ", () => {
    const targets = get_undefeated_target(this.enemy_formation.enemies);
    const playerAction = this.player.Shoot(targets);
    if (targets.length === 1)return this.round(playerAction);
    this.selectTarget(targets, playerAction)
  });
  protected special_option = new DescriptionOptions("Special", () => {
    this.selectItem(this.player.specialAttacks);
  });
  protected item_option = new DescriptionOptions("Item", () => {
    this.selectItem(this.player.inventory);
  });
  protected defend_option = new DescriptionOptions("Defend", () => {
    const playerAction = this.player.Defend([this.player]);
    this.round(playerAction);
  });
  protected auto_option = new DescriptionOptions("Auto", () => {
    this.round(this.player.IA_Action());
  });
  protected escape_option = new DescriptionOptions("Escape", () => {
    const [descriptionText, successfulEscaping] = this.enemy_formation.attemptEscape([this.player].concat(this.party))
    if (successfulEscaping) {
      this.master_service.descriptionHandler
        .flush(0)
        .tailDescription(new Description(descriptionText, [nextOption(this.master_service)]), 'battle')
        .nextDescription(false);
      return;
    }
    //player will do nothing
    const playerAction= new EmptyCommand(this.player,[])
    this.startRoundDescription.push(new Description(descriptionText, [nextOption(this.master_service)]))
    this.round(playerAction)
  });
  protected initialize_battle_options(): DescriptionOptions[] {
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
}
