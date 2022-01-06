import { pushBattleActionOutput } from 'src/gameLogic/custom/functions/htmlHelper.functions';
import { ActionOutput } from 'src/gameLogic/custom/Class/Character/Character.type';
import { BattleCommand } from 'src/gameLogic/custom/Class/Battle/BattleCommand';
import { Character } from 'src/gameLogic/custom/Class/Character/Character';
import { Weapon } from '../Equipment/Weapon/Weapon';
import { isStatusPreventAttack, StatusPreventAttack } from '../Status/StatusBattle';
export function get_undefeated_target(group: Character[]): Character[] {
  return group.filter(character => !character.is_defeated());
}

export function attack_order(characters: Character[]): Character[] {
  return characters.sort((character, other) => other.calculated_stats.initiative - character.calculated_stats.initiative)
}

export function AttackCommand(source: Character, targets: Character[]): BattleCommand
{
  const weapon = source.meleeWeapon;
  return new BattleCommand(
    source, targets, weapon.tags,
    (targets) => {
      const attackDescription: ActionOutput = [
        [],
        []
      ];
      if (source.hasTag('double attack'))
        attackWithWeapon(source, targets, weapon, attackDescription);
      attackWithWeapon(source, targets, weapon, attackDescription);
      return attackDescription;
    }
  )
}
export function ShootCommand(source: Character, targets: Character[]): BattleCommand
{
  const weapon = source.rangedWeapon;
  return new BattleCommand(
    source, targets, weapon.tags,
    (targets) => {
      const attackDescription: ActionOutput = [
        [],
        []
      ];
      if (source.hasTag('double shoot'))
        attackWithWeapon(source, targets, weapon, attackDescription);
      attackWithWeapon(source, targets, weapon, attackDescription);
      return attackDescription;
    }
  )
}
export function DefendCommand(source: Character, targets: Character[])
{
  const shield = source.shield;
  const defend_action = shield.defend(targets)
  return new BattleCommand(
    source, targets, shield.tags,
    (target) => defend_action
  )
}
/**
 * Attacks with a weapon.
 *
 * @param {Character} source The source of the attack.
 * @param {Character[]} targets The targets to attack.
 * @param {Weapon} weapon The weapon used to attack the targets.
 * @param {ActionOutput} attackDescription
 */
function attackWithWeapon(source: Character, targets: Character[], weapon: Weapon, attackDescription: ActionOutput) {
  for (const target of targets) pushBattleActionOutput(tryAttack(source, target, (target: Character) => weapon.attack(source, target)), attackDescription);
}

/**
 * Check if the attack action can be performed on the target character.
 *
 * @param {Character} target The target of the attack action.
 * @param {(target:Character)=>ActionOutput} action The action to be performed.
 * @return {*}  {ActionOutput}
 * @memberof Character
 */
export function tryAttack(source: Character, target: Character, action: (target: Character) => ActionOutput): ActionOutput
{
  if (source.hasTag('paralized')) return [
    [],
    [`${source.name} is paralized and can't move`]
  ];
  for (const status of source.iterStatus()) {
    const preventAttackStatus = status as unknown as StatusPreventAttack;
    if (isStatusPreventAttack(preventAttackStatus) && !preventAttackStatus?.canAttack(target)) return preventAttackStatus.preventAttackDescription(target)
  }
  return action(target);
}
