import React from 'react';

function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

function intersectTwo(a, b){
  return a.filter(function(n) {
    return b.indexOf(n) > -1;
  });
}

function differenceTwo(a, b){
  let inAButNotInB = a.filter(function(n) {
    return b.indexOf(n) === -1;
  });
  let inBButNotInA = b.filter(function(n) {
    return a.indexOf(n) === -1;
  });
  return inAButNotInB.concat(inBButNotInA);
}

export function filterMatch(string, filter){
  return string.match(new RegExp(escapeRegExp(filter), "i"));
}

export function filterHighlight(string, filter){
  return string.split(new RegExp("(" + escapeRegExp(filter) + ")", "i")).map((element, index)=>{
    if (index % 2 === 0){
      return <span key={index}>{element}</span>
    }
    return <b key={index}>{element}</b>
  });
}

export function colorIntToHex(color) {
  let b = (color & 255).toString(16);
  let g = ((color >> 8) & 255).toString(16);
  let r = ((color >> 16) & 255).toString(16);

  let rStr = r.length == 1 ? "0" + r : r;
  let gStr = g.length == 1 ? "0" + g : g;
  let bStr = b.length == 1 ? "0" + b : b;
	    
  return "#" + rStr + gStr + bStr;
}

export function intersect(...elements){
  if (elements.length === 1){
    return elements[0];
  }
  
  return elements.reduce(intersectTwo);
}

export function difference(...elements){
  if (elements.length === 1){
    return [];
  }
  
  return elements.reduce(differenceTwo);
}