export type game_state = 'map'|
                    'battle'|
                    'item'|
                    'excess-item'|
                    'shop'|
                    'perk-tree'|
                    'stat-up'|
                    'info'|
                    'status'|
                    'prepare'
                    ;

export const game_state_priority: game_state[] = [
  'prepare',
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
