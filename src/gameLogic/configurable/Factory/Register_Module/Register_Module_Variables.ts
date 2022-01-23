import { Reaction, BeforeActionReaction } from 'src/gameLogic/custom/Class/Character/Reaction/Reaction';
import { perk_switcher } from '../../../custom/Factory/PerkFactory';
import { quest_switcher } from '../../../custom/Factory/QuestFactory';
import { Quest } from 'src/gameLogic/custom/Class/Quest/Quest';
import { special_attack_switcher } from '../../../custom/Factory/SpecialAttackFactory';
import { status_switcher } from '../../../custom/Factory/StatusFactory';
import { character_switcher } from '../../../custom/Factory/CharacterFactory';
import { item_switcher } from '../../../custom/Factory/ItemFactory';
import { StatusBattle } from 'src/gameLogic/custom/Class/Status/StatusBattle';
import { Status } from 'src/gameLogic/custom/Class/Status/Status';
import { GameItem } from 'src/gameLogic/custom/Class/Items/Item';
import { Equipment } from 'src/gameLogic/custom/Class/Equipment/Equipment';
import { Weapon } from 'src/gameLogic/custom/Class/Equipment/Weapon/Weapon';
import { RangedWeapon } from 'src/gameLogic/custom/Class/Equipment/Weapon/RangedWeapon';
import { Shield } from 'src/gameLogic/custom/Class/Equipment/Shield';
import { Armor } from "../../../custom/Class/Equipment/Armor";
import { MeleeWeapon } from "../../../custom/Class/Equipment/Weapon/MeleeWeapon";
import { Character } from '../../../custom/Class/Character/Character';
import { UniqueCharacter } from '../../../custom/Class/Character/UniqueCharacter';
import { PersistentCharacter } from '../../../custom/Class/Character/NPC/PersistentCharacter';
import { TimedStatus } from '../../../custom/Class/Status/TimedStatus';
import { SpecialAttack } from '../../../custom/Class/Items/SpecialAttack/SpecialAttack';
import { Perk } from '../../../custom/Class/Perk/Perk';
import { reaction_switcher } from 'src/gameLogic/custom/Factory/ReactionFactory';
import { CharacterBattleClass } from 'src/gameLogic/custom/Class/CharacterBattleClass/CharacterBattleClass';
import { character_battle_class_switcher } from 'src/gameLogic/custom/Factory/CharacterBattleClassFactory';

export const constructor = {
  game_item:{
    GameItem,
    Equipment,
    Weapon, MeleeWeapon, RangedWeapon,
    Shield,
    Armor
  },
  character:{ Character,UniqueCharacter,PersistentCharacter },
  status:{ Status,TimedStatus,StatusBattle },
  special_attack:{SpecialAttack},
  quest:{Quest},
  perk:{Perk},
  reaction:{Reaction,BeforeActionReaction},
  character_battle_class:{CharacterBattleClass},
}
export type constructor_mapping = typeof constructor;
export const switcher = {
  game_item:  item_switcher ,
  character:  character_switcher ,
  status:     status_switcher ,
  special_attack: special_attack_switcher,
  quest:      quest_switcher ,
  perk:       perk_switcher ,
  reaction:   reaction_switcher,
  character_battle_class:character_battle_class_switcher,
}
export type switcher_mapping = typeof switcher
