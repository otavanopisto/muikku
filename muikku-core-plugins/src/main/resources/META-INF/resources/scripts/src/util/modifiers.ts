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

export function getUserImageUrl(user: UserType | number){
  let id:Number;
  if (typeof user === "number"){
    id = user;
  } else {
    id = user.id;
  }
  return `/rest/user/files/user/${id}/identifier/profile-image-96`
}