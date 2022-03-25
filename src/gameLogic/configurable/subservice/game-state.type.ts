export type game_state = 'map'|
                    'battle'|
                    'item'|
                    'excess-item'|
                    'shop'|
                    'perk-tree'|
                    'stat-up'|
                    'info'|
                    'status'|
                    'prepare'|
                    'front-page'|
                    'save-page'|
                    'talk'
                    ;

export const game_state_priority: game_state[] = [
  'prepare',
  'save-page',
  'front-page',
  'map',
  'talk',
  'item',
  'excess-item',
  'status',
  'battle',
  'shop',
  'perk-tree',
  'stat-up',
  'info'
];
