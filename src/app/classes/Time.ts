export class Time
{
  private static timeconvertion = {
    m       :1,
    min     :1,
    mins    :1,
    h       :60,
    hour    :60,
    hours   :60,
    d       :1440,
    day     :1440,
    days    :1440,
    M       :43200,
    month   :43200,
    months  :43200,
    y       :518400,
    year    :518400,
    years   :518400,
  }
  private minutes: number;

  constructor(minutes: number|string)
  {
    this.minutes = this.convert2Time(minutes);
  }

  setTime(value: number|string)
  {
    this.minutes = this.convert2Time(value);
  }

  getMinutes()
  {
    return this.minutes;
  }

  addTime(value:number|string)
  {
    this.minutes+=this.convert2Time(value);
  }

  getTimeValues():{Years:number,Months:number,Days:number,Hours:number,Minutes:number}
  {
    let backupMinutes = this.minutes;
    const values= {Years:0,Months:0,Days:0,Hours:0,Minutes:0};
    //year
    values.Years = Math.floor(backupMinutes/Time.timeconvertion.year)
    backupMinutes-= values.Years*Time.timeconvertion.year;
    //month
    values.Months = Math.floor(backupMinutes/Time.timeconvertion.month)
    backupMinutes-= values.Months*Time.timeconvertion.month
    //days
    values.Days = Math.floor(backupMinutes/Time.timeconvertion.days)
    backupMinutes-= values.Days*Time.timeconvertion.days
    //hours
    values.Hours = Math.floor(backupMinutes/Time.timeconvertion.hours)
    backupMinutes-= values.Hours*Time.timeconvertion.hours
    //minutes
    values.Minutes = backupMinutes;

    return values;
  }

  private convert2Time(value: number|string):number
  {
    if(typeof value === 'number') return value;
    const pendingConvertions = [];
    let unitIndex  = 0;
    let unitOffset = 0;
    while(unitOffset < value.length)
    {
      unitIndex = unitOffset;
      while((!isNaN(Number.parseInt(value[unitIndex])) || ['+','-'].includes(value[unitIndex])) && unitIndex < value.length){unitIndex++}
      const quantity = value.substring(unitOffset,unitIndex);
      unitOffset = unitIndex;
      while((isNaN(Number.parseInt(value[unitOffset])) && !['+','-'].includes(value[unitOffset]) ) && unitOffset < value.length){unitOffset++}
      const unit = value.substring(unitIndex,unitOffset);
      pendingConvertions.push([quantity,unit]);
    }
    const minutes = pendingConvertions.reduce((accumulator,[quantity,unit]) =>
    {
      if(!Time.timeconvertion?.[unit])
      {
        console.warn(`Unit ${unit} not supported`);
        return accumulator;
      }
      return Time.timeconvertion?.[unit]*Number.parseInt(quantity) + accumulator
    } ,0)
    return minutes;
  }
}
