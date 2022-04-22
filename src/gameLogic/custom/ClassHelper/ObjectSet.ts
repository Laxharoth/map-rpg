export class ObjectSet<T> extends Array<T&Hashable>{
  private mapSet:Map<string,T&Hashable> = new Map<string,T&Hashable>();
  get(hash:string):(T & Hashable)|undefined{return this.mapSet.get(hash);}
  has(hash:string):boolean{return this.mapSet.has(hash);}
  clear():void{this.mapSet.clear();super.splice(0,this.length)}
  push(...items: (T & Hashable)[]): number {
    const newItems = []
    for(const item of items)
    if(!this.mapSet.has(item.hash())){
      newItems.push(item)
      this.mapSet.set(item.hash(), item);
    }
    return super.push(...newItems);
  }
  pop(): T & Hashable | undefined {
    const item = super.pop();
    if(item)
      this.mapSet.delete(item.hash());
    return item
  }
  shift(): T & Hashable | undefined{
      const item = super.shift();
      if(item)
        this.mapSet.delete(item.hash());
      return item;
  }
  unshift(...items: (T & Hashable)[]): number {
    const newItems = []
    for(const item of items)
    if(this.mapSet.has(item.hash()))
    {
      newItems.push(item)
      this.mapSet.set(item.hash(), item);
    }
    return super.unshift(...newItems);
  }
  splice(start: any, deleteCount?: any, ...rest: (T & Hashable)[]): (T & Hashable)[] {
      const items = super.splice(start, deleteCount, ...rest);
      for(const item of items)this.mapSet.delete(item.hash());
      for(const item of rest) this.mapSet.set(item.hash(), item);
      return items;
  }
}
export interface Hashable{ hash(): string; }
