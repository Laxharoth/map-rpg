/**
 * A object to represent Time.
 *
 * @export
 * @class Time
 */
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

  /**
   * Adds to the current time the specified value.
   *
   * @param {(number|string)} value The time to add.
   * @memberof Time
   */
  addTime(value:number|string)
  {
    this.minutes+=this.convert2Time(value);
  }
  /**
   * Divides the minutes in the max posible integer value it can represent for each time unit.
   *
   * @return {*}  {{Years:number,Months:number,Days:number,Hours:number,Minutes:number}}
   * @memberof Time
   */
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
  /**
   * Converts a string into it's representation in minutes.
   *
   * @private
   * @param {(number|string)} value The time representation
   * @return {*}  {number} if number is provided return the number, otherwise the time representation of the string.
   * @memberof Time
   */
  private convert2Time(value: number|string):number
  {
    if(typeof value === 'number') return value;

    let unitIndex  = 0;
    let unitOffset = 0;
    const pendingConvertions = separateTime(unitOffset, value, unitIndex);
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
    function separateTime(unitOffset: number, value: string, unitIndex: number) {
      const pendingConvertions = []
      while (unitOffset < value.length) {
        let quantity:string;
        ({ quantity, unitIndex } = getNextQuantity(unitIndex, unitOffset, value));
        let unit:string;
        ({ unit, unitOffset } = getNextTimeUnit(unitOffset, unitIndex, value));
        pendingConvertions.push([quantity, unit]);
      }
      return pendingConvertions;
    }
    function getNextTimeUnit(unitOffset: number, unitIndex: number, value: string) {
      unitOffset = unitIndex;
      while ((isPartOfTimeUnit(value)) && unitOffset < value.length) { unitOffset++; }
      const unit = value.substring(unitIndex, unitOffset);
      return { unit, unitOffset };
    }

    function getNextQuantity(unitIndex: number, unitOffset: number, value: string) {
      unitIndex = unitOffset;
      while ((isPartOfNumber(value)) && unitIndex < value.length) { unitIndex++; }
      const quantity = value.substring(unitOffset, unitIndex);
      return { quantity, unitIndex };
    }

    function isPartOfTimeUnit(value:string) {
      return isNaN(Number.parseInt(value[unitOffset])) && !['+', '-'].includes(value[unitOffset]);
    }
    function isPartOfNumber(value:string) {
      return !isNaN(Number.parseInt(value[unitIndex])) || ['+', '-'].includes(value[unitIndex]);
    }
  }
}
