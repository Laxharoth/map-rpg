export type game_state = 'map'|
                    'battle'|
                    'item'|
                    'excess-item'|
                    'shop'|
                    'perk-tree'|
                    'stat-up'|
                    'info'|
                    'status'
                    ;

export const game_state_priority: game_state[] = [
  'map',
  'item',
  'excess-item',
  'status',
  'battle',
  'shop',
  'perk-tree',
  'stat-up',
  'info'
];
