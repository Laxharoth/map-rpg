import { EnemyFormation } from 'src/gameLogic/custom/Class/Character/NPC/EnemyFormations/EnemyFormation';
import { BeforeActionReaction, Reaction } from 'src/gameLogic/custom/Class/Character/Reaction/Reaction';
import { CharacterBattleClass } from 'src/gameLogic/custom/Class/CharacterBattleClass/CharacterBattleClass';
import { Equipment } from 'src/gameLogic/custom/Class/Equipment/Equipment';
import { Shield } from 'src/gameLogic/custom/Class/Equipment/Shield';
import { RangedWeapon } from 'src/gameLogic/custom/Class/Equipment/Weapon/RangedWeapon';
import { Weapon } from 'src/gameLogic/custom/Class/Equipment/Weapon/Weapon';
import { GameItem } from 'src/gameLogic/custom/Class/Items/Item';
import { Quest } from 'src/gameLogic/custom/Class/Quest/Quest';
import { Status } from 'src/gameLogic/custom/Class/Status/Status';
import { StatusBattle } from 'src/gameLogic/custom/Class/Status/StatusBattle';
import { characterBattleClassSwitcher } from 'src/gameLogic/custom/Factory/CharacterBattleClassFactory';
import { enemyFormationSwitcher } from 'src/gameLogic/custom/Factory/EnemyFormationFactory';
import { reactionSwitcher } from 'src/gameLogic/custom/Factory/ReactionFactory';
import { mapcollection } from 'src/gameLogic/custom/MapCollection/mapcollection';
import { roomcollection } from 'src/gameLogic/custom/MapCollection/roomcollection';
import { Character } from '../../../custom/Class/Character/Character';
import { PersistentCharacter } from '../../../custom/Class/Character/NPC/PersistentCharacter';
import { UniqueCharacter } from '../../../custom/Class/Character/UniqueCharacter';
import { Armor } from "../../../custom/Class/Equipment/Armor";
import { MeleeWeapon } from "../../../custom/Class/Equipment/Weapon/MeleeWeapon";
import { DamageSpecialAttack, SpecialAttack } from '../../../custom/Class/Items/SpecialAttack/SpecialAttack';
import { Perk } from '../../../custom/Class/Perk/Perk';
import { TimedStatus } from '../../../custom/Class/Status/TimedStatus';
import { characterSwitcher } from '../../../custom/Factory/CharacterFactory';
import { itemSwitcher } from '../../../custom/Factory/ItemFactory';
import { perkSwitcher } from '../../../custom/Factory/PerkFactory';
import { questSwitcher } from '../../../custom/Factory/QuestFactory';
import { specialAttackSwitcher } from '../../../custom/Factory/SpecialAttackFactory';
import { statusSwitcher } from '../../../custom/Factory/StatusFactory';

export const constructor = {
  gameItem:{
    GameItem,
    Equipment,
    Weapon, MeleeWeapon, RangedWeapon,
    Shield,
    Armor
  },
  character:{ Character,UniqueCharacter,PersistentCharacter },
  enemyFormation:{EnemyFormation},
  status:{ Status,TimedStatus,StatusBattle },
  specialAttack:{SpecialAttack,DamageSpecialAttack},
  quest:{Quest},
  perk:{Perk},
  reaction:{Reaction,BeforeActionReaction},
  characterBattleClass:{CharacterBattleClass},
}
export type constructor_mapping = typeof constructor;
export const switcher = {
  gameItem:  itemSwitcher ,
  character:  characterSwitcher ,
  enemyFormation: enemyFormationSwitcher ,
  status:     statusSwitcher ,
  specialAttack: specialAttackSwitcher,
  quest:      questSwitcher ,
  perk:       perkSwitcher ,
  reaction:   reactionSwitcher,
  characterBattleClass:characterBattleClassSwitcher,
  maps:mapcollection,
  rooms:roomcollection
}
export type switcherMapping = typeof switcher
