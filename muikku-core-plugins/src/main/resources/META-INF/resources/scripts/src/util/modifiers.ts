import * as React from 'react';
import { UserType, UserWithSchoolDataType } from '~/reducers/main-function/user-index';

function escapeRegExp(str: string) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

function intersectTwo(a: any[], b: any[]){
  return a.filter(function(n) {
    return b.indexOf(n) > -1;
  });
}

function differenceTwo(a: any[], b: any[]){
  let inAButNotInB = a.filter(function(n) {
    return b.indexOf(n) === -1;
  });
  let inBButNotInA = b.filter(function(n) {
    return a.indexOf(n) === -1;
  });
  return inAButNotInB.concat(inBButNotInA);
}

export function filterMatch(string: string, filter: string){
  return string.match(new RegExp(escapeRegExp(filter), "i"));
}

export function filterHighlight(string: string, filter: string){
  if (filter === ""){
    return React.createElement(
        "span",
        {},
        string
    );
  }
  return string.split(new RegExp("(" + escapeRegExp(filter) + ")", "i")).map((element, index)=>{
    if (index % 2 === 0){
      return React.createElement(
        "span",
        { key: index },
        element
      );
    }
    return React.createElement(
      "b",
      { key: index },
      element
    );
  });
}

export function colorIntToHex(color: number) {
  let b = (color & 255).toString(16);
  let g = ((color >> 8) & 255).toString(16);
  let r = ((color >> 16) & 255).toString(16);

  let rStr = r.length == 1 ? "0" + r : r;
  let gStr = g.length == 1 ? "0" + g : g;
  let bStr = b.length == 1 ? "0" + b : b;
	    
  return "#" + rStr + gStr + bStr;
}

export function hexToColorInt(hexColor: string) {
  let r = 255;
  let g = 255;
  let b = 255;

  if (hexColor) {
    if (hexColor.length == 7){
      hexColor = hexColor.slice(1);
    }
    
    r = parseInt(hexColor.slice(0, 2), 16);
    g = parseInt(hexColor.slice(2, 4), 16);
    b = parseInt(hexColor.slice(4, 6), 16);
  }
    
  return (r << 16) + (g << 8) + b;
}

export function intersect(...elements:any[]){
  if (elements.length === 1){
    return elements[0];
  }
  
  return elements.reduce(intersectTwo);
}

export function difference(...elements:any[]){
  if (elements.length === 1){
    return [];
  }
  
  return elements.reduce(differenceTwo);
}

export function flatten(...elements:any[]){
  if (elements.length === 1){
    return elements[0];
  } else if (elements.length === 0){
    return [];
  }
  
  return elements.reduce((a, b)=>{
    return a.concat(b);
  });
}

export function escapeHTML(str: string){
  return str.replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function unescapeHTML(str: string){
  const doc = new DOMParser().parseFromString(str, "text/html");
  return doc.documentElement.textContent;
}

export function getName(user: UserType | UserWithSchoolDataType){
  if (!user){
    return "";
  }
  return user.firstName + (user.lastName ? " " + user.lastName : "");
}

export function getUserImageUrl(user: UserType | number, size?: number, version?: number){
  let id:Number;
  if (typeof user === "number"){
    id = user;
  } else {
    id = user.id;
  }
  return `/rest/user/files/user/${id}/identifier/profile-image-${size || 96}?v=${version || 1}`
}

export function shortenGrade(grade: string){
  if ("" + parseInt(grade) === grade){
    return grade;
  }
  return grade[0];
}

export function getShortenGradeExtension(grade: string){
  if ("" + parseInt(grade) === grade){
    return ""
  }
  return " - " + grade;
}

export function hashCode(str: string) {
  var hash = 0, i, chr;
  if (str.length === 0) return hash;
  for (i = 0; i < str.length; i++) {
    chr   = str.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

export function resize(img: HTMLImageElement, width: number, mimeType?: string, quality?: number) {
  let canvas = document.createElement('canvas');
  let ctx = canvas.getContext("2d");
  let oc = document.createElement('canvas');
  let octx = oc.getContext('2d');
  
  // set size proportional to image
  canvas.width = width;
  canvas.height = canvas.width * (img.height / img.width);;

  oc.width = img.width * 0.5;
  oc.height = img.height * 0.5;
  octx.drawImage(img, 0, 0, oc.width, oc.height);

  // step 2
  octx.drawImage(oc, 0, 0, oc.width * 0.5, oc.height * 0.5);

  // step 3, resize to final size
  ctx.drawImage(oc, 0, 0, oc.width * 0.5, oc.height * 0.5,
  0, 0, canvas.width, canvas.height);
  
  return canvas.toDataURL(mimeType || "image/jpeg", quality || 0.9);
}

export function shuffle(array: Array<any>) {
  let currentIndex = array.length;
  let temporaryValue;
  let randomIndex;

  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

type TypescriptBuggyTakeThisCallbackComeOn =  (element:any)=>any;

export function arrayToObject(array: Array<any>, propertyName: string, propertyValue?: string | TypescriptBuggyTakeThisCallbackComeOn) {
  let obj:any = {};
  array.forEach((element: any)=>{
    obj[element[propertyName]] = propertyValue ? (typeof propertyValue === "string" ? element[propertyValue] : propertyValue(element)) : element;
  });
  return obj;
}

const translations:any = {
  "width": "width",
  "class": "className",
  "src": "src",
  "height": "height"
}

export function CSSStyleDeclarationToObject(declaraion: CSSStyleDeclaration){
  let result:any = {};
  Object.keys(declaraion).forEach((key: string)=>{
    if (key !== "cssText" && key !== "length" || parseInt(key) === NaN){
      result[key] = (declaraion as any)[key];
    }
  });
}

export function HTMLtoReactComponent(element: HTMLElement, processer?: (tag: string, props: any, children: Array<any>, element: HTMLElement)=>any, key?: number):any {
  let defaultProcesser = processer ? processer : (a:any, b:any, c:any)=>React.createElement(a,b,c);
  let props:any = {
    key
  }
  Array.from(element.attributes).forEach((attr:Attr)=>{
    if (translations[attr.name]){
      props[translations[attr.name]] = attr.value
    }
  });
  if (element.style.cssText){
    props.style = CSSStyleDeclarationToObject(element.style);
  }
  let children = Array.from(element.childNodes).map((node, index)=>{
    if (node instanceof HTMLElement){
      return HTMLtoReactComponent(node, defaultProcesser, index)
    }
    return node.textContent;
  });
  if (!children.length){
    children = null;
  }
  return defaultProcesser(
      element.tagName.toLowerCase(),
      props,
      children,
      element
  );
}

export function extractDataSet(element: HTMLElement):any{
  let finalThing:any = {
     ...element.dataset
  };
  Array.from(element.childNodes).map((node, index)=>{
    if (node instanceof HTMLElement){
      finalThing = {
        ...finalThing,
        ...extractDataSet(node)
      }
    }
  });
  
  return finalThing;
}

export function guidGenerator() {
  let S4 = function() {
     return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
  };
  return (S4()+S4()+"."+S4()+"."+S4()+"."+S4()+"."+S4()+S4()+S4());
}