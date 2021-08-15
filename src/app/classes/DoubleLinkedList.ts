export class DoubleLinkedList
{
    head:DoubleLinkedListNode|null;
    length:number;
    constructor(...values:Array<any>)
    {
        this.head = null;
        this.length =  0;
        this.insertHead(...values);
    }
    get next()
    {
        if(this.length===0 || this.head===null) return null;
        return this.head.next;
    }
    insertHead(...values:Array<any>)
    {
        if(values.length===0) return null;
        const valuesReversed = values.reverse();
        for(const value of valuesReversed)
        {
            this.head = new DoubleLinkedListNode(value,null,this.head);
            if(this.next!==null)
                this.next.prev = this.head;
            this.length++;
        }
        return valuesReversed[0];
    }
    insertBefore(index:number,...values:Array<any>)
    {
        if(values.length===0) return null;
        if(index < 0 || index > this.length) return null;

        if(index===0)
            return this.insertHead(...values);

        const valuesReversed = values.reverse();
        let prev = this.head;
        for(let i = 0; i < index-1 && prev;i++){
            prev = prev.next;
        }

        for(const value of valuesReversed)
        {
            if(prev)
            {
              prev.next = new DoubleLinkedListNode(value,prev,prev.next);
              this.length++;
            }
        }

        return valuesReversed[0];
    }
    insertTail(...values:Array<any>)
    {
      this.insertBefore(this.length,...values);
    }
    removeAt(index:number)
    {
        if(this.length===0 || !this.head) return null;
        if(index < 0 || index >= this.length )return null;
        if(index===undefined) index = 0;

        if(index===0)
        {
            const returnValue = this.head.value;
            this.head = this.next;
            if(this.head)
                this.head.prev = null;
            this.length--;
            return returnValue;
        }

        let prev = this.head;
        for(let i = 0; i < index-1 && prev.next; i++){
            prev = prev.next;
        }
        if(prev.next)
        {
          const returnValue = prev.next.value;
          prev.next = prev.next.next;
          if(prev.next)
            prev.next.prev = prev;
          this.length--;
          return returnValue;
        }
    }
    lookAt(index:number)
    {
        if(index===undefined) return null;
        if(index < 0|| index >= this.length) return null;

        let current = this.head;
        for(let i = 0; i < index && current ; i++) current = current.next;

        if(current) return current.value;
    }
    getNode(index:number)
    {
        if(index < 0 || index >= this.length || index === null) return null;
        if(!this.head) return null;
        if(index===undefined) index = 0;
        if(index===0) return this.head;

        let current = this.head;
        for(let i = 0; i < index && current.next; i++) current = current.next;
        return current;
    }
    iterator()
    {
        if(this.length===0)return (function*(){})();
        let current = this.head;
        return (function*(){
                    while(current!==null) {
                        yield current.value;
                        current = current.next;
                    }
                })()
    }
    reverse()
    {
        if(this.length===0)return (function*(){})();
        let current = this.head;
        if(current)
          while(current.next) current = current.next;
        return (function*(){
                    while(current!==null) {
                        yield current.value;
                        current = current.prev;
                    }
                })()
    }
}

class DoubleLinkedListNode
{
    value:any;
    prev:DoubleLinkedListNode|null;
    next:DoubleLinkedListNode|null;
    constructor(value:any,prev:DoubleLinkedListNode|null,next:DoubleLinkedListNode|null)
    {
        this.value = value;
        this.prev = prev;
        this.next = next;
    }
}
