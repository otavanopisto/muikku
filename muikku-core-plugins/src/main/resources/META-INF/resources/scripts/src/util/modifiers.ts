import * as React from 'react';
import { UserType, UserWithSchoolDataType, UserStaffType } from '~/reducers/user-index';
import $ from '~/lib/jquery';
import { MaterialContentNodeListType } from '~/reducers/workspaces';

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
  let accumulator:Array<Array<any>> = [[]];
  string.split(new RegExp("(" + escapeRegExp(filter) + "|\\s)", "i")).forEach((element, index)=>{
    if (element === ""){
      return;
    } else if (element === " "){
      accumulator.push([]);
    } else if (element.toLocaleLowerCase() === filter.toLocaleLowerCase()) {
      accumulator[accumulator.length - 1].push(React.createElement(
          "span",
          { key: index, className: 'form-element__autocomplete-highlight'},         
          element
      ))
    } else {
      accumulator[accumulator.length - 1].push(element);
    }
  });
  
  let spans = accumulator.map((childMap, index)=>React.createElement("span",{key: index},...childMap));
  let newChild:Array<any> = [];
  spans.forEach((s, index)=>{
    newChild.push(s);
    if (index !== spans.length - 1){
      newChild.push(" ");
    }
  })
  return newChild;
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

export function getName(user: any, hasFullNamePermission: boolean){
  if (!user){
    return "";
  }
  let userText = "";
  
  if (user.firstName && (hasFullNamePermission || !user.nickName)){
    userText += user.firstName;
  }
  
  if (user.nickName && hasFullNamePermission){
    userText += (userText ? ' "' : '"') + user.nickName + '"';
  } else if (user.nickName) {
    userText += (userText ? ' ' : '') + user.nickName;
  }
  
  if (user.lastName){
    userText += (userText ? ' ' : '') + user.lastName;
  }
  
  return userText;
}

export function getUserImageUrl(user: UserType | number, type?: number | string, version?: number){
  let id:Number;
  if (typeof user === "number"){
    id = user;
  } else {
    id = user.id;
  }
  return `/rest/user/files/user/${id}/identifier/profile-image-${type || 96}?v=${version || 1}`
}

export function shortenGrade(grade: string){
  if (grade === null) {
    return "";
  }
  if ("" + parseInt(grade) === grade){
    return grade;
  }
  return grade[0];
}

export function getShortenGradeExtension(grade: string){
  if (grade === null) {
    return "";
  }
  if ("" + parseInt(grade) === grade){
    return "";
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
  
  // set size proportional to image
  canvas.width = width;
  canvas.height = canvas.width * (img.height / img.width);

  // step 3, resize to final size
  ctx.drawImage(img, 0, 0, img.width, img.height,
  0, 0, canvas.width, canvas.height);
  
  return canvas.toDataURL(mimeType || "image/jpeg", quality || 0.9);
}

export function shuffle(oArray: Array<any>) {
  let array = [...oArray];
  
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
  "height": "height",
  "href": "href",
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

export function scrollToSection(anchor: string, onScrollToSection?: ()=>any, scrollPadding?: number, disableAnimate?: boolean, disableAnchorSet?: boolean) {
  console.log("CALLED SCROLL TO", anchor);
  let actualAnchor = anchor + ',[data-id="' + anchor.replace("#", "") + '"]';
  try {
    if (!$(actualAnchor).size()){
      if (!disableAnchorSet){
        if (anchor[0] === "#"){
          window.location.hash = anchor;
        } else  {
          window.location.href = anchor;
        }
      }
      return;
    }
  } catch (err){
    if (!disableAnchorSet){
      if (anchor[0] === "#"){
        window.location.hash = anchor;
      } else  {
        window.location.href = anchor;
      }
    }
    return;
  }
  
  console.log("scrolling is being sucessful");
  
  let topOffset = scrollPadding || 90;
  let scrollTop = $(actualAnchor).offset().top - topOffset;

  onScrollToSection && onScrollToSection();
  if (disableAnimate){
    $('html, body').scrollTop(scrollTop);
  } else {
    $('html, body').stop().animate({
      scrollTop : scrollTop
    }, {
      duration : 500,
      easing : "easeInOutQuad"
    });
  }
  
  if (!disableAnchorSet){
    setTimeout(()=>{
      if (anchor[0] === "#"){
        window.location.hash = anchor;
      } else  {
        window.location.href = anchor;
      }
    }, 500);
  }
}

export function repairContentNodes(base: MaterialContentNodeListType, pathRepair?: string, pathRepairId?: number, parentNodeId?: number): MaterialContentNodeListType {
  if (base === null) {
    return null;
  }

  return base.map((cn, index) => {
    const nextSibling = base[index + 1];
    const nextSiblingId = nextSibling ? nextSibling.workspaceMaterialId : null;
    const parentId = typeof parentNodeId !== "number" ? cn.parentId : parentNodeId;
    let path = cn.path;
    if (pathRepair && pathRepairId === cn.workspaceMaterialId) {
      path = pathRepair;
    } else if (pathRepair && pathRepairId === parentNodeId) {
      const splitted = path.split("/");
      splitted.shift();
      path = [pathRepairId, ...splitted].join("/");
    }
    const children = cn.children && cn.children.length ? repairContentNodes(cn.children, pathRepair, pathRepairId, cn.workspaceMaterialId) : cn.children;
    
    return {
      ...cn,
      nextSiblingId,
      parentId,
      children,
      path,
    }
  });
}

export function validURL(str: string) {
  var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(str);
  }