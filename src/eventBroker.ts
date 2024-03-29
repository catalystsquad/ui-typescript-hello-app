interface subscriptionCallback {
  (eventName: string, data: object | string | Array<any>): void;
}

let events: Map<string,Map<string,Function>> = new Map<string,Map<string,Function>>()

function SubscribeEvent(eventName: string, subscriber: string, callback:subscriptionCallback) {
  let handler = (e:CustomEvent) => {
    callback(eventName, e.detail)
  }
  if (events.get(eventName) === undefined || events.get(eventName) === null) {
    events.set(eventName, new Map<string,Function>())
  }
  events.get(eventName)!.set(subscriber, handler)
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  document.addEventListener(eventName, handler)
}

function UnsubscribeEvent(eventName: string, subscriber: string) :boolean {
  let callback = events.get(eventName)?.get(subscriber);
  if (callback) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    document.removeEventListener(eventName, callback)
    events.get(eventName)?.delete(subscriber)
    return true
  }
  return false
}

function FireEvent(eventName: string, data: object) {
  document.dispatchEvent(new CustomEvent(eventName, {detail: data}))
}

function addListeners(num: number){
  for(let i = 0; i < num; i++){
    let listener = (eventName: string, foo: any) => {
      // If all is well, no console.log, which is good because that's slow
      if(eventName != 'amazingEvent') {
        console.log(eventName)
      }
      if (foo.foo != 'bar') {
        console.log(foo.foo)
      }
    }
    SubscribeEvent('amazingEvent', 'i:'+i, listener)
  }
}

function removeListeners(num: number){
  for(let i = 1; i < num; i++){
    UnsubscribeEvent('amazingEvent', 'i:'+i)
  }
  // Unsubscribe the same (first) event 4 times, it should be fine
  UnsubscribeEvent('amazingEvent', 'i:'+0)
  UnsubscribeEvent('amazingEvent', 'i:'+0)
  UnsubscribeEvent('amazingEvent', 'i:'+0)
  let result = UnsubscribeEvent('amazingEvent', 'i:'+0)
  if (result) {
    // this will never be seen
    console.log('for some reason it succeeded removing the handler again')
  }
}

function nowString(): string {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();

  return mm + '/' + dd + '/' + yyyy + ' @ ' + today.getHours() + ':' + today.getSeconds() + ':' + today.getMilliseconds();
}

function testEvents() {
  console.log('adding listeners', nowString())
  addListeners(40000);
  console.log('firing event', nowString())
  FireEvent('amazingEvent',{foo: 'bar'}) 
  console.log('removing listeners', nowString())
  removeListeners(3);
  console.log('firing event', nowString())
  FireEvent('amazingEvent',{foo: 'bar'}) 
  console.log('finished event', nowString())
}
// testEvents()

export {SubscribeEvent, FireEvent, UnsubscribeEvent }
