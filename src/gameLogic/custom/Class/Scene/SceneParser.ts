import { SCENE_PARSER_ELEMENT_SEPARATOR, SCENE_PARSER_STOPCHAR, SCENE_PARSER_ELEMENT_STOPCHAR } from './../../customTypes/constants';
import { Renderer2 } from "@angular/core";

export function sceneStringParse(sceneString:string,renderer:Renderer2):HTMLElement[]{
  const elements:HTMLElement[] = [];
  const topLevel = new ArrayToHTMLElementAppendAddapter(elements);
  for(const str of sceneString.split(SCENE_PARSER_ELEMENT_SEPARATOR)
    .map((text,index) => (index%2===0)? `span{${text}}`: text)){
      elementBuilder(str,topLevel,topLevel,renderer);
    }
  return  elements;
}

function elementBuilder(elementString:string,
  topLevel:{appendChild:(element:HTMLElement)=>any},
  parentElement:{appendChild:(element:HTMLElement)=>any},
  renderer:Renderer2){
  if(!elementString.length){ return; }
  const currentElementString = elementString.substring(0,
    Math.min(
    ...SCENE_PARSER_ELEMENT_STOPCHAR.map(char => elementString.indexOf(char)).filter(index => index > -1)
    ) || elementString.length
  );
  const newElement = renderer.createElement(extractTagname(currentElementString));
  const text = extractText(currentElementString);
  let currentElementStringClearText = currentElementString;
  if(text.length){
    currentElementStringClearText = currentElementString.replace(text,'');
    renderer.appendChild(newElement,renderer.createText(text));
  }
  for(const elementClass of extractClasses(currentElementStringClearText)){
    renderer.addClass(newElement,elementClass);
  }
  const elementId = extractId(currentElementStringClearText)
  if(elementId)
    renderer.setAttribute(newElement,'id',elementId);
  for(const {key,value} of extractAttributes(currentElementStringClearText)){
    renderer.setAttribute(newElement,key,value);
  }
  parentElement.appendChild(newElement);
  const nextElementParentSelector = elementString.charAt(currentElementString.length);
  let nextParent:{appendChild:(element:HTMLElement)=>any};
  switch (nextElementParentSelector){
    case '+': nextParent = parentElement; break;
    case '>': nextParent = newElement; break;
    case '^': if(!(parentElement instanceof HTMLElement)){
      nextParent = topLevel;
      break;
    }
    nextParent = renderer.parentNode(parentElement) || topLevel;
    break;
    default: return;
  }
  elementBuilder(elementString.substring(currentElementString.length+1),
    topLevel,
    nextParent,
    renderer);
}

class ArrayToHTMLElementAppendAddapter{
  private array:HTMLElement[];
  constructor(array:HTMLElement[]){
    this.array = array;
  }
  appendChild(child:HTMLElement){
    this.array.push(child);
  }
  getArray(){
    return this.array.slice(0);
  }
}
function extractText(currentElementString: string) {
  const textIndex = currentElementString.indexOf('{');
  const text = currentElementString.substring(textIndex + 1, currentElementString.indexOf('}', textIndex));
  return text;
}

function extractAttributes(currentElementString: string) {
  const attributes: ({ key: string; value: string; })[] = [];
  let attributeIndex = currentElementString.indexOf('[');
  while (attributeIndex > -1) {
    const stopIndex = currentElementString.indexOf(']', attributeIndex);
    const [key, value] = currentElementString.substring(attributeIndex + 1, stopIndex).split('=');
    attributes.push({ key, value });
    attributeIndex = currentElementString.indexOf('[', stopIndex);
  }
  return attributes;
}

function extractId(currentElementString: string) {
  const idIndex = currentElementString.indexOf('#');
  if(idIndex === -1){return;}
  const elementId = currentElementString.substring(idIndex+1, Math.min(
    ...SCENE_PARSER_STOPCHAR.map(char => currentElementString.indexOf(char,idIndex+1)).filter(index => index > -1)
  ) || currentElementString.length);
  return elementId;
}

function extractClasses(currentElementString: string) {
  const classes: string[] = [];
  let classIndex = currentElementString.indexOf('.');
  while (classIndex > -1) {
    const stopIndex = Math.min(
      ...SCENE_PARSER_STOPCHAR.map(char => currentElementString.indexOf(char,classIndex+1)).filter(index => index > -1)
    ) || currentElementString.length;
    classes.push(currentElementString.substring(classIndex + 1, stopIndex));
    classIndex = currentElementString.indexOf('.', classIndex + 1);
  }
  return classes;
}

function extractTagname(currentElementString: string) {
  return currentElementString.substring(0,
    Math.min(
      ...SCENE_PARSER_STOPCHAR.map(char => currentElementString.indexOf(char)).filter(index => index > -1)
    ) || currentElementString.length
  );
}
