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
  let accumulator:Array<Array<any>> = [[]];
  string.split(new RegExp("(" + escapeRegExp(filter) + "|\\s)", "i")).forEach((element, index)=>{
    if (element === ""){
      return;
    } else if (element === " "){
      accumulator.push([]);
    } else if (element === filter) {
      accumulator[accumulator.length - 1].push(React.createElement(
          "b",
          {key: index},
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

export function getName(user: UserType | UserWithSchoolDataType, hasFullNamePermission: boolean){
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
  
  // set size proportional to image
  canvas.width = width;
  canvas.height = canvas.width * (img.height / img.width);

  // step 3, resize to final size
  ctx.drawImage(img, 0, 0, img.width, img.height,
  0, 0, canvas.width, canvas.height);
  
  return canvas.toDataURL(mimeType || "image/jpeg", quality || 0.9);
}