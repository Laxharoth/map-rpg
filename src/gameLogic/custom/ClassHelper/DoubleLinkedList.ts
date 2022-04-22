export class DoubleLinkedList<T>{
  head:DoubleLinkedListNode<T>|null;
  length:number;
  constructor(...values:T[]){
      this.head = null;
      this.length =  0;
      this.insertHead(...values);
  }
  get next():DoubleLinkedListNode<T> | null{
      if(this.length===0 || this.head===null){ return null; }
      return this.head.next;
  }
  insertHead(...values:T[]):T | null{
      if(values.length===0){ return null; }
      const valuesReversed = values.reverse();
      for(const value of valuesReversed){
          this.head = new DoubleLinkedListNode<T>(value,null,this.head);
          if(this.next!==null)
              this.next.prev = this.head;
          this.length++;
      }
      return valuesReversed[0];
  }
  insertBefore(index:number,...values:T[]):T | null{
      if(values.length===0){ return null; }
      if(index < 0 || index > this.length) return null;
      if(index===0){
        return this.insertHead(...values);
      }
      const valuesReversed = values.reverse();
      let prev = this.head;
      for(let i = 0; i < index-1 && prev;i++){
          prev = prev.next;
      }
      for(const value of valuesReversed){
          if(prev){
            prev.next = new DoubleLinkedListNode(value,prev,prev.next);
            this.length++;
          }
      }
      return valuesReversed[0];
  }
  insertTail(...values:T[]):T|null{
    return this.insertBefore(this.length,...values);
  }
  removeAt(index:number):T|null{
      if(this.length===0 || !this.head) return null;
      if(index < 0 || index >= this.length )return null;
      if(index===undefined) index = 0;
      let removedNode:T|null = null;
      if(index===0){
        removedNode = this.head.value;
          this.head = this.next;
          if(this.head)
              this.head.prev = null;
          this.length--;
          return removedNode;
      }
      let prev = this.head;
      for(let i = 0; i < index-1 && prev.next; i++){
          prev = prev.next;
      }
      removedNode = prev.next?.value || null;
      prev.next = prev.next?.next || null;
      if(prev.next)
        prev.next.prev = prev;
      this.length--;
      return removedNode;
  }
  lookAt(index:number):T|null{
      if(index===undefined){ return null; }
      if(index < 0|| index >= this.length){ return null; }
      let current = this.head;
      for(let i = 0; i < index && current ; i++) current = current.next;
      return current?.value||null;
  }
  getNode(index:number):DoubleLinkedListNode<T> | null{
      if(index < 0 || index >= this.length || index === null){ return null; }
      if(!this.head){ return null; }
      if(index===undefined){ index = 0; }
      if(index===0) return this.head;
      let current = this.head;
      for(let i = 0; i < index && current.next; i++) current = current.next;
      return current;
  }
  clear():void{
    this.head = null;
    this.length =  0;
  }
  iterator(){
      if(this.length===0)return (function*(){ return; })();
      let current = this.head;
      return (function*(){
                  while(current!==null){
                      yield current.value;
                      current = current.next;
                  }
              })()
  }
  reverse(){
      if(this.length===0)return (function*(){ return; })();
      let current = this.head;
      if(current)
        while(current.next) current = current.next;
      return (function*(){
                  while(current!==null){
                      yield current.value;
                      current = current.prev;
                  }
              })()
  }
}

// tslint:disable-next-line: max-classes-per-file
export class DoubleLinkedListNode<T>{
  value:T;
  prev:DoubleLinkedListNode<T>|null;
  next:DoubleLinkedListNode<T>|null;
  constructor(value:T,prev:DoubleLinkedListNode<T>|null,next:DoubleLinkedListNode<T>|null){
      this.value = value;
      this.prev = prev;
      this.next = next;
  }
}
