import { pushBattleActionOutput } from 'src/gameLogic/custom/functions/htmlHelper.functions';
import { GameItem } from 'src/gameLogic/custom/Class/Items/Item';
import { ActionOutput } from 'src/gameLogic/custom/Class/Character/Character';
import { Description } from 'src/gameLogic/custom/Class/Descriptions/Description';
import { MAXOPTIONSNUMBERPERPAGE } from 'src/gameLogic/custom/customTypes/constants';
import { DescriptionOptions } from 'src/gameLogic/custom/Class/Descriptions/Description';
import { MasterService } from "src/app/service/master.service";
import { Character } from "src/gameLogic/custom/Class/Character/Character";
import { EnemyFormation } from "src/gameLogic/custom/Class/Character/NPC/EnemyFormations/EnemyFormation";
import { attackOrder, getUndefeatedTarget } from './Battle.functions';
import { nextOption } from '../Descriptions/CommonOptions';
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

  constructor(master_service: MasterService, enemy_formation: EnemyFormation) {
    this.player = master_service.partyHandler.user;
    this.party = master_service.partyHandler.party;
    this.enemy_formation = enemy_formation;
    master_service.enemyHandler.enemyFormation = enemy_formation;
    this.master_service = master_service;
    [this.player].concat(this.party).forEach(character => {
      character.specialAttacks.forEach(attacker => {
        attacker.cooldown = 0
      })
    })
    this.initialize_battle_options();
  }
  /**
   * Iterates the character actions appling their actions.
   *
   * @param {(target:Character[])=>ActionOutput} playerAction
   * @param {Character[]} playerTarget
   */
  round(playerAction: (target: Character[]) => ActionOutput, playerTarget: Character[]): void {
    const partyIsDefeated = () => { return getUndefeatedTarget([this.player].concat(this.party)).length === 0 }
    const turn_characters = attackOrder(getUndefeatedTarget([this.player].concat(this.party).concat(this.enemy_formation.enemies)))
    for (const character of turn_characters) {
      //check if was defeated this round
      if (character.currentCoreStats.hitpoints <= 0) {
        pushBattleActionOutput(character.onDefeated(), [this.battleRoundDescription, this.battleRoundString])
        continue;
      }
      if (character === this.player) {
        pushBattleActionOutput(playerAction(playerTarget), [this.battleRoundDescription, this.battleRoundString]);
        continue;
      }
      pushBattleActionOutput(character.IA_Action(), [this.battleRoundDescription, this.battleRoundString])
      if (this.enemy_formation.IsDefeated) {
        for (const enem of this.enemy_formation.enemies) {
          pushBattleActionOutput(enem.onDefeated(), [this.battleRoundDescription, this.battleRoundString]);
        }
        break;
      }
      if (partyIsDefeated()) {
        for (const ally of [this.player].concat(this.party)) {
          pushBattleActionOutput(ally.onDefeated(), [this.battleRoundDescription, this.battleRoundString]);
        };
        break;
      }
    }
    if (this.enemy_formation.IsDefeated) {
      this.battleRoundDescription.push(this.endBattlePlayerWins())
    } else if (partyIsDefeated()) {
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

    for (const character of getUndefeatedTarget([this.player].concat(this.party).concat(this.enemy_formation.enemies))) {
      const [description, string] = character.startRound();
      this.startRoundDescription.push(...description)
      this.startRoundString.push(...string)
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
  private selectTarget(targets: Character[], playerAction: (target: Character[]) => ActionOutput): void {
    const targetsOptions: DescriptionOptions[] = [];
    for (const target of targets) {
      targetsOptions.push(new DescriptionOptions(target.name, () => {
        this.round(playerAction, [target])
      }))
    }
    if (targetsOptions.length <= MAXOPTIONSNUMBERPERPAGE) {
      while (targetsOptions.length < MAXOPTIONSNUMBERPERPAGE - 1) targetsOptions.push(null);
      targetsOptions.push(new DescriptionOptions('return', () => {
        this.master_service.descriptionHandler.nextDescription(false)
      }))
    } else {
      while (targetsOptions.length % MAXOPTIONSNUMBERPERPAGE - 2 !== MAXOPTIONSNUMBERPERPAGE - 3) targetsOptions.push(null);
      targetsOptions.push(new DescriptionOptions('return', () => {
        this.master_service.descriptionHandler.nextDescription(false)
      }))
    }
    this.master_service.descriptionHandler
      .headDescription(new Description(
          () => `${targets.map(target=>`${target.name}:${target.currentCoreStats.hitpoints}`).join('\n')}`,
          targetsOptions
        ),
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
      const playerAction = (target: Character[]) => this.player.useItem(item, target);
      options.push(new DescriptionOptions(item.name, () => {
        const targets = []
          .concat(item.isSelfUsable ? [this.player] : [])
          .concat(item.isPartyUsable ? getUndefeatedTarget(this.party) : [])
          .concat(item.isEnemyUsable ? getUndefeatedTarget(this.enemy_formation.enemies) : [])
        if (item.isSingleTarget && targets.length > 1) {
          return this.selectTarget(targets, playerAction)
        }
        this.round(playerAction, targets);
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
      this.player.healHitPoints(this.player.coreStats.hitpoints);
      this.master_service.descriptionHandler
        .tailDescription(this.enemy_formation.onEnemyVictory([this.player].concat(this.party)), 'battle')
        .nextDescription(false);
    })
    return new Description(() => `${this.battleRoundString.join("\n\n")}`, [nextOption]);
  }
  protected playerParalizedOption = new DescriptionOptions("Paralized", () => {
    this.round((target: Character[]) => [
      [],
      []
    ], [])
  })
  protected attack_option = new DescriptionOptions("Attack", () => {
    const targets = getUndefeatedTarget(this.enemy_formation.enemies);
    const playerAction = (target: Character[]) => this.player.Attack(target);
    if (targets.length === 1)
      return this.round(playerAction, targets);
    this.selectTarget(targets, playerAction);
  });
  protected shoot_option = new DescriptionOptions("Shoot ", () => {
    const targets = getUndefeatedTarget(this.enemy_formation.enemies);
    const playerAction = (target: Character[]) => this.player.Shoot(target);
    if (targets.length === 1)
      return this.round(playerAction, targets);
    this.selectTarget(targets, playerAction)
  });
  protected special_option = new DescriptionOptions("Special", () => {
    this.selectItem(this.player.specialAttacks);
  });
  protected item_option = new DescriptionOptions("Item", () => {
    this.selectItem(this.player.inventory);
  });
  protected defend_option = new DescriptionOptions("Defend", () => {
    const playerAction = (target: Character[]) => this.player.Defend(target);
    this.round(playerAction, [this.player]);
  });
  protected auto_option = new DescriptionOptions("Auto", () => {
    this.round((target: Character[]) => this.player.IA_Action(), []);
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
    const playerAction: (target: Character[]) => ActionOutput = (target: Character[]) => {
      return [
        [],
        []
      ]
    }
    this.startRoundDescription.push(new Description(descriptionText, [nextOption(this.master_service)]))
    this.round(playerAction, [])
  });
  protected initialize_battle_options(): void {
    this.battle_options = [
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
