/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import { StaticDataset } from "~/components/base/material-loader/types";
import { User } from "~/generated/client";
import $ from "~/lib/jquery";
import { MaterialContentNodeWithIdAndLogic } from "~/reducers/workspaces";

/**
 * escapeRegExp
 * @param str str
 */
function escapeRegExp(str: string) {
  /**
   * This regExp need some kind of rethinking because linter is giving
   * error how it is composed
   */

  // eslint-disable-next-line no-useless-escape
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

/**
 * intersectTwo
 * @param a a
 * @param b b
 */
function intersectTwo(a: any[], b: any[]) {
  return a.filter(function (n) {
    return b.indexOf(n) > -1;
  });
}

/**
 * differenceTwo
 * @param a a
 * @param b b
 */
function differenceTwo(a: any[], b: any[]) {
  const inAButNotInB = a.filter(function (n) {
    return b.indexOf(n) === -1;
  });
  const inBButNotInA = b.filter(function (n) {
    return a.indexOf(n) === -1;
  });
  return inAButNotInB.concat(inBButNotInA);
}

/**
 * filterMatch
 * @param string string
 * @param filter filter
 */
export function filterMatch(string: string, filter: string) {
  return string.match(new RegExp(escapeRegExp(filter), "i"));
}

/**
 * filterHighlight
 * @param string string
 * @param filter filter
 */
export function filterHighlight(string: string, filter: string) {
  if (filter === "") {
    return React.createElement("span", {}, string);
  }
  const accumulator: Array<Array<any>> = [[]];
  string
    .split(new RegExp("(" + escapeRegExp(filter) + "|\\s)", "i"))
    .forEach((element, index) => {
      if (element === "") {
        return;
      } else if (element === " ") {
        accumulator.push([]);
      } else if (element.toLocaleLowerCase() === filter.toLocaleLowerCase()) {
        accumulator[accumulator.length - 1].push(
          React.createElement(
            "span",
            { key: index, className: "form-element__autocomplete-highlight" },
            element
          )
        );
      } else {
        accumulator[accumulator.length - 1].push(element);
      }
    });

  const spans = accumulator.map((childMap, index) =>
    React.createElement("span", { key: index }, ...childMap)
  );
  const newChild: Array<any> = [];
  spans.forEach((s, index) => {
    newChild.push(s);
    if (index !== spans.length - 1) {
      newChild.push(" ");
    }
  });
  return newChild;
}

/**
 * colorIntToHex
 * @param color color
 */
export function colorIntToHex(color: number) {
  const b = (color & 255).toString(16);
  const g = ((color >> 8) & 255).toString(16);
  const r = ((color >> 16) & 255).toString(16);

  const rStr = r.length == 1 ? "0" + r : r;
  const gStr = g.length == 1 ? "0" + g : g;
  const bStr = b.length == 1 ? "0" + b : b;

  return "#" + rStr + gStr + bStr;
}

/**
 * hexToColorInt
 * @param hexColor hexColor
 */
export function hexToColorInt(hexColor: string) {
  let r = 255;
  let g = 255;
  let b = 255;

  if (hexColor) {
    if (hexColor.length == 7) {
      hexColor = hexColor.slice(1);
    }

    r = parseInt(hexColor.slice(0, 2), 16);
    g = parseInt(hexColor.slice(2, 4), 16);
    b = parseInt(hexColor.slice(4, 6), 16);
  }

  return (r << 16) + (g << 8) + b;
}

/**
 * intersect
 * @param {...any} elements elements
 */
export function intersect(...elements: any[]) {
  if (elements.length === 1) {
    return elements[0];
  }

  return elements.reduce(intersectTwo);
}

/**
 * difference
 * @param {...any} elements elements
 */
export function difference(...elements: any[]) {
  if (elements.length === 1) {
    return [];
  }

  return elements.reduce(differenceTwo);
}

/**
 * flatten
 * @param {...any} elements elements
 */
export function flatten(...elements: any[]) {
  if (elements.length === 1) {
    return elements[0];
  } else if (elements.length === 0) {
    return [];
  }

  return elements.reduce((a, b) => a.concat(b));
}

/**
 * escapeHTML
 * @param str str
 */
export function escapeHTML(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * unescapeHTML
 * @param str str
 */
export function unescapeHTML(str: string) {
  const doc = new DOMParser().parseFromString(str, "text/html");
  return doc.documentElement.textContent;
}

/**
 * getName
 * @param user user
 * @param hasFullNamePermission hasFullNamePermission
 */
export function getName(user: any, hasFullNamePermission: boolean) {
  if (!user) {
    return "";
  }
  let userText = "";

  if (user.firstName && (hasFullNamePermission || !user.nickName)) {
    userText += user.firstName;
  }

  if (user.nickName && hasFullNamePermission) {
    userText += (userText ? ' "' : '"') + user.nickName + '"';
  } else if (user.nickName) {
    userText += (userText ? " " : "") + user.nickName;
  }

  if (user.lastName) {
    userText += (userText ? " " : "") + user.lastName;
  }

  return userText;
}

/**
 * getUserImageUrl
 * @param user user
 * @param type type
 * @param version version
 */
export function getUserImageUrl(
  user: User | number,
  type?: number | string,
  version?: number
) {
  let id: number;
  if (typeof user === "number") {
    id = user;
  } else {
    id = user.id;
  }
  return `/rest/user/files/user/${id}/identifier/profile-image-${
    type || 96
  }?v=${version || 1}`;
}

/**
 * shortenGrade
 * @param grade grade
 */
export function shortenGrade(grade: string) {
  if (grade === null) {
    return "";
  }
  if ("" + parseInt(grade) === grade) {
    return grade;
  }
  return grade[0];
}

/**
 * getShortenGradeExtension
 * @param grade grade
 */
export function getShortenGradeExtension(grade: string) {
  if (grade === null) {
    return "";
  }
  if ("" + parseInt(grade) === grade) {
    return "";
  }
  return " - " + grade;
}

/**
 * hashCode
 * @param str str
 */
export function hashCode(str: string) {
  let hash = 0,
    i,
    chr;
  if (str.length === 0) return hash;
  for (i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

/**
 * resize
 * @param img img
 * @param width width
 * @param mimeType mimeType
 * @param quality quality
 */
export function resize(
  img: HTMLImageElement,
  width: number,
  mimeType?: string,
  quality?: number
) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  // set size proportional to image
  canvas.width = width;
  canvas.height = canvas.width * (img.height / img.width);

  // step 3, resize to final size
  ctx.drawImage(
    img,
    0,
    0,
    img.width,
    img.height,
    0,
    0,
    canvas.width,
    canvas.height
  );

  return canvas.toDataURL(mimeType || "image/jpeg", quality || 0.9);
}

/**
 * shuffle
 * @param oArray oArray
 */
export function shuffle(oArray: Array<any>) {
  const array = [...oArray];

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

type TypescriptBuggyTakeThisCallbackComeOn = (element: any) => any;

/**
 * arrayToObject
 * @param array array
 * @param propertyName propertyName
 * @param propertyValue propertyValue
 */
export function arrayToObject(
  array: Array<any>,
  propertyName: string,
  propertyValue?: string | TypescriptBuggyTakeThisCallbackComeOn
) {
  const obj: any = {};
  array.forEach((element: any) => {
    obj[element[propertyName]] = propertyValue
      ? typeof propertyValue === "string"
        ? element[propertyValue]
        : propertyValue(element)
      : element;
  });
  return obj;
}

const translations: any = {
  width: "width",
  class: "className",
  id: "id",
  name: "name",
  src: "src",
  height: "height",
  href: "href",
  target: "target",
  alt: "alt",
  title: "title",
  dir: "dir",
  lang: "lang",
  hreflang: "hrefLang",
  charset: "charSet",
  download: "download",
  rel: "rel",
  type: "type",
  media: "media",
  wrap: "wrap",
  start: "start",
  reversed: "reversed",

  // Iframe  specific
  scrolling: "scrolling",
  frameborder: "frameBorder",
  allowfullscreen: "allowFullScreen",
  allow: "allow",
  loading: "loading",

  // Table specefic
  cellspacing: "cellSpacing", // Deprecated, Table
  cellpadding: "cellPadding", // Deprecated, Table
  span: "span",
  summary: "summary", // Deprecated, Table
  colspan: "colSpan",
  rowspan: "rowSpan",
  scope: "scope",
  headers: "headers",

  // Audio/video specific
  autoplay: "autoPlay",
  capture: "capture",
  controls: "controls",
  loop: "loop",
  role: "role",
  label: "label",
  default: "default",
  kind: "kind",
  srclang: "srcLang",
  controlsList: "controlsList",

  // Form specific
  required: "required",
  rows: "rows",
  cols: "cols",
  tabindex: "tabIndex",
  hidden: "hidden",
  list: "list",
  value: "value",
  selected: "selected",
  checked: "checked",
  disabled: "disabled",
  readonly: "readOnly",
  size: "size",
  placeholder: "placeholder",
  multiple: "multiple",
  accept: "accept",
};

/**
 * Converts a style property string into a camel case based one
 * this is basically to convert things like text-align into textAlign
 * for use within react
 * @param str the string to convert
 */
function convertStylePropertyToCamelCase(str: string) {
  // first we split the dashes
  const splitted = str.startsWith("-") ? [] : str.split("-");

  // if it's just one then we return that just one
  if (splitted.length === 1) {
    return splitted[0];
  }

  // otherwise we do this process of capitalization
  return (
    splitted[0] +
    splitted
      .slice(1)
      .map((word) => word[0].toUpperCase() + word.slice(1))
      .join("")
  );
}

/**
 * CSSStyleDeclarationToObject
 * @param declaraion declaraion
 */
export function CSSStyleDeclarationToObject(declaraion: CSSStyleDeclaration) {
  const result: any = {};
  for (let i = 0; i < declaraion.length; i++) {
    const item = declaraion.item(i);
    result[convertStylePropertyToCamelCase(item)] = (declaraion as any)[item];
  }
  return result;
}

/**
 * HTMLToReactComponentRule
 */
export interface HTMLToReactComponentRule {
  shouldProcessHTMLElement: (tag: string, element: HTMLElement) => boolean;
  preventChildProcessing?: boolean;
  processingFunction?: (
    tag: string,
    props: any,
    children: Array<any>,
    element: HTMLElement
  ) => any;
  preprocessReactProperties?: (
    tag: string,
    props: any,
    children: Array<any>,
    element: HTMLElement
  ) => string | void;
  preprocessElement?: (element: HTMLElement) => string | void;
  id?: string;
}

/**
 * HTMLtoReactComponent
 * @param element element
 * @param rules rules
 * @param key key
 */
export function HTMLtoReactComponent(
  element: HTMLElement,
  rules?: HTMLToReactComponentRule[],
  key?: number
): any {
  if (element.nodeType === 3) {
    return element.textContent;
  }

  let tagname = element.tagName.toLowerCase();
  const matchingRule = rules.find((r) =>
    r.shouldProcessHTMLElement(tagname, element)
  );

  if (matchingRule && matchingRule.preprocessElement) {
    tagname = matchingRule.preprocessElement(element) || tagname;
  }

  /**
   * defaultProcesser
   * @param tag tag
   * @param props props
   * @param children children
   */
  const defaultProcesser = (tag: string, props: any, children: Array<any>) =>
    React.createElement(tag, props, children);

  const actualProcesser = matchingRule
    ? matchingRule.processingFunction || defaultProcesser
    : defaultProcesser;

  const props: any = {
    key,
  };
  Array.from(element.attributes).forEach((attr: Attr) => {
    if (translations[attr.name]) {
      props[translations[attr.name]] = attr.value;
    }
  });
  if (element.style.cssText) {
    props.style = CSSStyleDeclarationToObject(element.style);
  }
  const shouldProcessChildren = matchingRule
    ? !matchingRule.preventChildProcessing
    : true;
  const children = shouldProcessChildren
    ? Array.from(element.childNodes).map((node, index) => {
        if (node instanceof HTMLElement) {
          return HTMLtoReactComponent(node, rules, index);
        }
        return node.textContent;
      })
    : [];

  if (matchingRule && matchingRule.preprocessReactProperties) {
    tagname =
      matchingRule.preprocessReactProperties(
        tagname,
        props,
        children,
        element
      ) || tagname;
  }

  const finalChildren = children.length === 0 ? null : children;

  return actualProcesser(tagname, props, finalChildren, element);
}

/**
 * extractDataSet
 * @param element element
 */
export function extractDataSet<T extends StaticDataset>(
  element: HTMLElement
): T {
  let finalThing: any = {
    ...element.dataset,
  };
  Array.from(element.childNodes).map((node) => {
    if (node instanceof HTMLElement) {
      finalThing = {
        ...finalThing,
        ...extractDataSet(node),
      };
    }
  });

  return finalThing;
}

/**
 * guidGenerator
 */
export function guidGenerator() {
  /**
   * S4
   */
  const S4 = function () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };
  return (
    S4() +
    S4() +
    "." +
    S4() +
    "." +
    S4() +
    "." +
    S4() +
    "." +
    S4() +
    S4() +
    S4()
  );
}

/**
 * scrollToSection
 * @param anchor anchor
 * @param onScrollToSection onScrollToSection
 * @param scrollPadding scrollPadding
 * @param disableAnimate disableAnimate
 * @param disableAnchorSet disableAnchorSet
 */
export function scrollToSection(
  anchor: string,
  onScrollToSection?: () => any,
  scrollPadding?: number,
  disableAnimate?: boolean,
  disableAnchorSet?: boolean
) {
  const actualAnchor = anchor + ',[data-id="' + anchor.replace("#", "") + '"]';
  try {
    if (!$(actualAnchor).size()) {
      if (!disableAnchorSet) {
        if (anchor[0] === "#") {
          window.location.hash = anchor;
        } else {
          window.location.href = anchor;
        }
      }
      return;
    }
  } catch (err) {
    if (!disableAnchorSet) {
      if (anchor[0] === "#") {
        window.location.hash = anchor;
      } else {
        window.location.href = anchor;
      }
    }
    return;
  }

  const topOffset = scrollPadding || 90;
  const scrollTop = $(actualAnchor).offset().top - topOffset;

  onScrollToSection && onScrollToSection();
  if (disableAnimate) {
    $("html, body").scrollTop(scrollTop);
  } else {
    $("html, body").stop().animate(
      {
        scrollTop: scrollTop,
      },
      {
        duration: 500,
        easing: "easeInOutQuad",
      }
    );
  }

  if (!disableAnchorSet) {
    setTimeout(() => {
      if (anchor[0] === "#") {
        window.location.hash = anchor;
      } else {
        window.location.href = anchor;
      }
    }, 500);
  }
}

/**
 * repairContentNodes
 * @param base base
 * @param pathRepair pathRepair
 * @param pathRepairId pathRepairId
 * @param parentNodeId parentNodeId
 */
export function repairContentNodes(
  base: MaterialContentNodeWithIdAndLogic[],
  pathRepair?: string,
  pathRepairId?: number,
  parentNodeId?: number
): MaterialContentNodeWithIdAndLogic[] {
  if (base === null) {
    return null;
  }

  return base.map((cn, index) => {
    const nextSibling = base[index + 1];
    const nextSiblingId = nextSibling ? nextSibling.workspaceMaterialId : null;
    const parentId =
      typeof parentNodeId !== "number" ? cn.parentId : parentNodeId;
    let path = cn.path;
    if (pathRepair && pathRepairId === cn.workspaceMaterialId) {
      path = pathRepair;
    } else if (pathRepair && pathRepairId === parentNodeId) {
      const splitted = path.split("/");
      splitted.shift();
      path = [pathRepair, ...splitted].join("/");
    }
    const children =
      cn.children && cn.children.length
        ? repairContentNodes(
            cn.children,
            pathRepair,
            pathRepairId,
            cn.workspaceMaterialId
          )
        : cn.children;

    return {
      ...cn,
      nextSiblingId,
      parentId,
      children,
      path,
    };
  });
}

/**
 * validURL
 * @param str str
 */
export function validURL(str: string) {
  const pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // fragment locator
  return !!pattern.test(str);
}
