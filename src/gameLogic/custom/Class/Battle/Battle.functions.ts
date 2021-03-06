import { pushBattleActionOutput } from 'src/gameLogic/custom/functions/htmlHelper.functions';
import { ActionOutput } from 'src/gameLogic/custom/Class/Character/Character.type';
import { BattleCommand, DEFEND_PRIORITY } from 'src/gameLogic/custom/Class/Battle/BattleCommand';
import { Character } from 'src/gameLogic/custom/Class/Character/Character';
import { isStatusPreventAttack, StatusPreventAttack } from '../Status/StatusBattle';
import { attack, DamageSource } from './DamageSource';
import { MasterService } from 'src/app/service/master.service';
import { nextOption } from '../Scene/CommonOptions';

export function getUndefeatedTarget(group: Character[]): Character[] {
  return group.filter(character => !character.isDefeated());
}
export function AttackCommand(source: Character, targets: Character[]): BattleCommand{
  const weapon = source.characterEquipment.meleeWeapon;
  return {
    source, target:targets, tags:weapon.tags,
    excecute(){
      const attackDescription: ActionOutput = [[],[]];
      if (source.hasTag('double attack'))
        attackWithDamageSource(source, this.target, weapon, attackDescription);
      attackWithDamageSource(source, this.target, weapon, attackDescription);
      return attackDescription;
    }
  }
}
export function ShootCommand(source: Character, targets: Character[]): BattleCommand{
  const weapon = source.characterEquipment.rangedWeapon;
  return {
    source, target:targets, tags:weapon.tags,
    excecute(){
      const attackDescription: ActionOutput = [ [], [] ];
      if (source.hasTag('double shoot'))
        attackWithDamageSource(source, this.target, weapon, attackDescription);
      attackWithDamageSource(source, this.target, weapon, attackDescription);
      return attackDescription;
    }
  }
}
export function DefendCommand(source: Character, targets: Character[]):BattleCommand{
  const shield = source.characterEquipment.shield;
  return {
    source, target:targets, tags:shield.tags,
    excecute:() => shield.defend(targets),
    priority:DEFEND_PRIORITY
    };
}
/** Attacks with a damage source. */
function attackWithDamageSource(source: Character,
  targets: Character[], damageSource: DamageSource, attackDescription: ActionOutput) {
  for (const target of targets){
    pushBattleActionOutput(tryAttack(source, target,
      (attackTarget: Character) => attack(damageSource,source, attackTarget)), attackDescription);
  }
}
export function escapeBattle(masterService: MasterService){
  const { partyHandler } = masterService;
  const [descriptionText, successfulEscaping] =  partyHandler.enemyFormation.attemptEscape(partyHandler.userParty)
  if (successfulEscaping) {
    partyHandler.battleEnded('escape')
    masterService.sceneHandler
      .flush(0)
      .tailScene({sceneData: ()=>descriptionText, options:[nextOption(masterService)]}, 'battle')
      .nextScene(false);
  }
}
/** Check if the attack action can be performed on the target character. */
export function tryAttack(source: Character,
    target: Character, action: (target: Character) => ActionOutput): ActionOutput{
  if (source.hasTag('paralized')) return [ [], [`${source.name} is paralized and can't move`] ];
  for (const status of source.iterStatus()) {
    const preventAttackStatus = status as unknown as StatusPreventAttack;
    if (isStatusPreventAttack(preventAttackStatus) && !preventAttackStatus?.canAttack(target)){
      return preventAttackStatus.preventAttackDescription(target);
    }
  }
  return action(target);
}
