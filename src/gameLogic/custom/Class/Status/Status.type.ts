export enum statusEnum {
  'status' ='status',
}
export enum statusTimeEnum{
  'TimedStatusTest' ='TimedStatusTest',
}
export enum statusBattlesEnum{
  'Defend'  ='Defend' ,
  'Paralisis'   ='Paralisis' ,
  'Poison'  ='Poison' ,
  'Ranged Attack' ='Ranged Attack' ,
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
}

export type statusname =`${statusEnum}`| `${statusTimeEnum}`| `${statusBattlesEnum}`
