export enum statusEnum {
  'status' ='status',
}
export enum statusTimeEnum{
  'TimedStatusTest' ='TimedStatusTest',
}
export enum statusBattlesEnum{
  'StatusDefend'  ='StatusDefend' ,
  'Paralisis'   ='Paralisis' ,
  'Poison'  ='Poison' ,
  'StatusRangedAttack' = 'StatusRangedAttack' ,
  'Blind'   ='Blind' ,
  'Charm'   ='Charm' ,
  'Fright'  ='Fright' ,
  'Grappled'  ='Grappled',
  'Grappling' ='Grappling',
  'Invisible' ='Invisible',
  'Petrified' ='Petrified',
  'Prone' ='Prone',
  'Restrained'  ='Restrained',
  'Sleep' ='Sleep',
  'PoisonRush'='PoisonRush',
  'StatusGuard'='StatusGuard',
  "Hide"="Hide",
  "Advantage"="Advantage",
  "Guidance"="Guidance",
}

export type statustype =`${statusEnum}`| `${statusTimeEnum}`| `${statusBattlesEnum}`
