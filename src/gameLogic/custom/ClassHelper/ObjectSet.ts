export class ObjectSet<T> extends Array<T&hashable>{
  private mapSet:Map<string,T&hashable> = new Map<string,T&hashable>();
  get(hash:string):(T & hashable)|undefined{return this.mapSet.get(hash);}
  has(hash:string):boolean{return this.mapSet.has(hash);}
  clear():void{this.mapSet.clear();super.splice(0,this.length)}
  push(...items: (T & hashable)[]): number {
    const new_items = []
    for(const item of items)
    if(!this.mapSet.has(item.hash())){
      new_items.push(item)
      this.mapSet.set(item.hash(), item);
    }
    return super.push(...new_items);
  }
  pop(): T & hashable | undefined {
    const item = super.pop();
    item && this.mapSet.delete(item.hash());
    return item
  }
  shift(): T & hashable | undefined{
      const item = super.shift();
      item && this.mapSet.delete(item.hash());
      return item;
  }
  unshift(...items: (T & hashable)[]): number {
    const new_items = []
    for(const item of items)
    if(this.mapSet.has(item.hash()))
    {
      new_items.push(item)
      this.mapSet.set(item.hash(), item);
    }
    return super.unshift(...new_items);
  }
  splice(start: any, deleteCount?: any, ...rest: (T & hashable)[]): (T & hashable)[] {
      const items = super.splice(start, deleteCount, ...rest);
      for(const item of items)this.mapSet.delete(item.hash());
      for(const item of rest) this.mapSet.set(item.hash(), item);
      return items;
  }
}
export interface hashable{ hash(): string; }
