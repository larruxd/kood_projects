// creates VDOM
function createVirtualDOM(tag, attributes = {}, eventHandlers = {}, properties = {}, ...children) {
  const element = {
    tag,
    attrs: { ...attributes },
    property: { ...eventHandlers, ...properties },
    children,
  };

  // Custom methods
  // change tag
  element.setTag = function (newTag) {
    const oldVDOM = JSON.parse(JSON.stringify(element));
    element.tag = newTag;
    replaceParentNode(framework.obj, oldVDOM, element);
    return Element;
  };

  // attributes

  // add/change attributes
  element.setAttr = function (key, val) {
    const oldVDOM = JSON.parse(JSON.stringify(element));
    if (element.attrs.hasOwnProperty(key)) {
      element.attrs[key] += ' ' + val;
    } else {
      element.attrs[key] = val;
    }
    replaceParentNode(framework.obj, oldVDOM, element);
    return element;
  };

  element.removeAttr = function (key, val, replaceVal) {
    const oldVDOM = JSON.parse(JSON.stringify(element));
    if (val !== undefined) {
      if (key === 'style') {
        element.attrs[key] = replaceVal;
      } else {
        if (element.attrs.hasOwnProperty(key)) {
          element.attrs[key] = element.attrs[key].replace(val, replaceVal);
        }
      }
    } else {
      if (element.attrs.hasOwnProperty(key)) {
        delete element.attrs[key];
      }
    }
    replaceParentNode(framework.obj, oldVDOM, element);
    return element;
  };

  // properties

  // add/change properties
  element.setProp = function (key, val) {
    const oldVDOM = JSON.parse(JSON.stringify(element));
    element.property[key] = val;
    replaceParentNode(framework.obj, oldVDOM, element);
    return element;
  };

  element.removeProp = function (key, replaceValue) {
    const oldVDOM = JSON.parse(JSON.stringify(element));
    if (val !== undefined) {
      if (element.property.hasOwnProperty(key)) {
        element.property[key] = replaceValue;
      }
    } else {
      if (element.property.hasOwnProperty(key)) {
        delete element.property[key];
      }
    }
    replaceParentNode(framework.obj, oldVDOM, element);
    return element;
  };

  // children

  // add child
  element.setChild = function (...obj) {
    const newVDOM = JSON.parse(JSON.stringify(element)); // Create a deep copy of element
    const newChildren = [...element.children, ...obj];
    newVDOM.children = newChildren;
    replaceParentNode(framework.obj, element, newVDOM);
    element.children = newVDOM.children;
    return element;
  };

  element.removeChildren = function (index, deleteCount) {
    const newVDOM = JSON.parse(JSON.stringify(element));
    const newChildren = element.children.slice(index, deleteCount);
    newVDOM.children = newChildren;
    replaceParentNode(framework.obj, element, newVDOM);
    return element;
  };

  // make a copy of element
  element.copy = function () {
    const copiedElement = createVirtualDOM(element.tag, element.attrs, element.property);
    copiedElement.children = element.children.map((child) => (child.copy ? child.copy() : child));

    // Recursively copy children's children
    copiedElement.children.forEach((child, index) => {
      if (child.children) {
        copiedElement.children[index].children = child.children.map((nestedChild) => (nestedChild.copy ? nestedChild.copy() : nestedChild));
      }
    });
    return copiedElement;
  };

  return element;
}

// all html tags
const htmlTags = [
  'a',
  'abbr',
  'address',
  'area',
  'article',
  'aside',
  'audio',
  'b',
  'base',
  'bdi',
  'bdo',
  'blockquote',
  'body',
  'br',
  'button',
  'canvas',
  'caption',
  'cite',
  'code',
  'col',
  'colgroup',
  'data',
  'datalist',
  'dd',
  'del',
  'details',
  'dfn',
  'dialog',
  'div',
  'dl',
  'dt',
  'em',
  'embed',
  'fieldset',
  'figcaption',
  'figure',
  'footer',
  'form',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'head',
  'header',
  'hr',
  'html',
  'i',
  'iframe',
  'img',
  'input',
  'ins',
  'kbd',
  'label',
  'legend',
  'li',
  'link',
  'main',
  'map',
  'mark',
  'meta',
  'meter',
  'nav',
  'noscript',
  'object',
  'ol',
  'optgroup',
  'option',
  'output',
  'p',
  'param',
  'picture',
  'pre',
  'progress',
  'q',
  'rb',
  'rp',
  'rt',
  'rtc',
  'ruby',
  's',
  'samp',
  'script',
  'section',
  'select',
  'slot',
  'small',
  'source',
  'span',
  'strong',
  'style',
  'sub',
  'summary',
  'sup',
  'table',
  'tbody',
  'td',
  'template',
  'textarea',
  'tfoot',
  'th',
  'thead',
  'time',
  'title',
  'tr',
  'track',
  'u',
  'ul',
  'var',
  'video',
  'wbr',
];

// creates createVirtualDOM function for each html tag
const tag = {};
htmlTags.forEach((tagName) => {
  tag[tagName] = (attributes = {}, eventHandlers = {}, properties = {}, ...children) =>
    createVirtualDOM(tagName, attributes, eventHandlers, properties, ...children);
});

// creates and returns real DOM from createVirtualDOM obj.
export function createNode(obj) {
  const result = document.createElement(obj.tag);
  if (obj.attrs) {
    for (const [key, value] of Object.entries(obj.attrs)) {
      if (typeof value === 'object') {
        for (const [styleKey, styleValue] of Object.entries(value)) {
          result.style[styleKey] = styleValue;
        }
      } else {
        result.setAttribute(key, value);
      }
    }
  }

  if (obj.children) {
    for (const child of obj.children) {
      if (typeof child == 'string') {
        result.appendChild(text(child));
      } else {
        result.appendChild(createNode(child));
      }
    }
  }

  if (obj.property) {
    for (const [key, value] of Object.entries(obj.property)) {
      result[key] = value;
    }
  }

  return result;
}

// creates text text node for input
export function text(input) {
  return document.createTextNode(input);
}

// deep searches through the all keys, with the exception of tag,
// of the input object and returns two identical arrays [untouch, toModify]
// of the parent objs that match the input value
function getObjByAttrsAndPropsVal(obj, value) {
  const result = [];
  // console.log(obj)
  function searchInObject(obj, parent) {
    for (const prop in obj) {
      // console.log({ prop }, obj[prop])

      const currentValue = obj[prop];
      if (typeof currentValue === 'object') {
        searchInObject(currentValue, obj, prop);
      } else if (typeof currentValue === 'string') {
        if (currentValue.split(' ').includes(value)) {
          if (prop != 'tag') result.push(parent);
        }
      } else if (currentValue === value) {
        if (prop != 'tag');
        result.push(parent);
      }
    }
  }
  searchInObject(obj, null, null);
  if (result.length === 1) {
    return result[0];
  }
  return result;
}

// deep searches through the tag key of the input object and returns
// two identical arrays [untouch, toModify] of objs that match the
// input value
function getObjByTag(obj, value) {
  const result = [];
  function searchInObject(obj) {
    for (const prop in obj) {
      const currentValue = obj[prop];
      if (typeof currentValue === 'object') {
        searchInObject(currentValue, obj, prop);
      } else if (currentValue === value) {
        if (prop === 'tag') {
          result.push(obj);
        }
      }
    }
  }

  searchInObject(obj, null, null);
  return [result];
}

// replaces the old node obj with modified/new node object and
// applies those changes to real node whilst updating the specified
// object.
function replaceParentNode(obj, node, modifiedNode) {
  let oldSection = JSON.parse(JSON.stringify(obj));
  function replaceObject(obj, node, modifiedNode) {
    if (obj === node) {
      Object.assign(obj, modifiedNode);
    } else {
      if (obj.children) {
        for (let i = 0; i < obj.children.length; i++) {
          replaceObject(obj.children[i], node, modifiedNode);
        }
      }
    }
  }
  replaceObject(obj, node, modifiedNode);
  const patch = difference(oldSection, obj);
  framework.rootEl = patch(framework.rootEl);
  framework.obj = obj;
}

// updates specified obj in accordance to state changes and apply
// those changes to the real DOM.
function update(newApp) {
  const patch = difference(framework.obj, newApp);
  framework.rootEl = patch(framework.rootEl);
  framework.obj = newApp;
}

const MINI = {
  tag,
  createNode,
  getObjByAttrsAndPropsVal,
  getObjByTag,
  update,
};

// ---------------Diffence Code-----------------
function zip(a, b) {
  const zipped = [];
  for (let i = 0; i < Math.min(a.length, b.length); i++) {
    zipped.push([a[i], b[i]]);
  }
  return zipped;
}

function diffAttrs(oldAttrs, newAttrs) {
  const patches = [];

  // Set new attributes
  for (const [k, v] of Object.entries(newAttrs)) {
    if (k === 'style') {
      // Handle style attribute
      patches.push((node) => {
        if (node.nodeType !== Node.TEXT_NODE) {
          Object.assign(node.style, v);
        }
        return node;
      });
    } else {
      // Handle other attributes
      patches.push((node) => {
        if (node.nodeType !== Node.TEXT_NODE) {
          node.setAttribute(k, v);
        }
        return node;
      });
    }
  }

  // Remove old attributes
  for (const [k] of Object.entries(oldAttrs)) {
    if (!(k in newAttrs)) {
      patches.push((node) => {
        if (node.nodeType !== Node.TEXT_NODE) {
          node.removeAttribute(k);
        }
        return node;
      });
    }
  }

  return (node) => {
    for (const patch of patches) {
      patch(node);
    }
  };
}

function diffProperty(oldProperty, newProperty) {
  const patches = [];
  // set new properties
  for (const [k, v] of Object.entries(newProperty)) {
    patches.push((node) => {
      node[k] = v;
      return node;
    });
  }
  // remove old attributes
  for (const [k] of Object.entries(oldProperty)) {
    if (!(k in newProperty)) {
      patches.push((node) => {
        delete node.k;
        return node;
      });
    }
  }
  return (node) => {
    for (const patch of patches) {
      patch(node);
    }
  };
}

// returns array of function to apply to the children of DOM,
// in accordance to the new attribute object
function diffChildren(oldVChildren, newVChildren) {
  const childPatches = [];
  // changes the content of children within the same range of previous state.
  for (const [oldVChild, newVChild] of zip(oldVChildren, newVChildren)) {
    if (typeof oldVChild === 'string' || typeof newVChild === 'string') {
      if (oldVChild !== newVChild) {
        childPatches.push((node) => {
          node.replaceWith(text(newVChild));
          return node;
        });
      }
    } else {
      childPatches.push(difference(oldVChild, newVChild));
    }
  }

  // adds additional children
  const additionalPatches = [];
  const additionalElements = newVChildren.slice(oldVChildren.length);
  for (const addVChild of additionalElements) {
    if (typeof addVChild == 'string') {
      additionalPatches.push((node) => {
        node.appendChild(text(addVChild));
        return node;
      });
    } else {
      additionalPatches.push((node) => {
        const newNode = createNode(addVChild);
        node.appendChild(newNode);
        return node;
      });
    }
  }

  // removes deleted children
  const removalPatches = [];
  for (const removeVChild of oldVChildren.slice(newVChildren.length)) {
    removalPatches.push((node) => {
      node.removeChild(node.lastChild);
      return node;
    });
  }

  return (parent) => {
    // applies corresponding function child node (patch= function, child= child node)
    for (const [patch, child] of zip(childPatches, parent.childNodes)) {
      patch(child);
    }
    // appends child to parent
    for (const patch of additionalPatches) {
      patch(parent);
    }
    // removes child from parent
    for (const patch of removalPatches) {
      patch(parent);
    }

    return parent;
  };
}

// Performs a diff between two virtual DOM and creates a patch
// function that is be applied to the real DOM, updating it.
function difference(oldVD, newVD) {
  // Handle the case where newVD is undefined (i.e., node should be removed)
  if (newVD === undefined) {
    return (node) => {
      node.remove();
      return undefined;
    };
  }

  // Handle the case where either oldVD or newVD is a string
  if (typeof oldVD === 'string' || typeof newVD === 'string') {
    if (oldVD === newVD) {
      return (node) => {
        const newNode = createNode(newVD);
        node.replaceWith(newNode);
        return newNode;
      };
    } else {
      return (node) => undefined;
    }
  }

  // Handle the case where oldVD and newVD have different tags
  if (oldVD.tag !== newVD.tag) {
    return (node) => {
      const newNode = createNode(newVD);
      node.replaceWith(newNode);
      return newNode;
    };
  }

  // Perform diffing for attributes, properties, and children
  const patchAttrs = diffAttrs(oldVD.attrs, newVD.attrs);
  const patchProperties = diffProperty(oldVD.property, newVD.property);
  const patchChildren = diffChildren(oldVD.children, newVD.children);

  // Return the patch function that applies the diffing changes to the real DOM
  return (node) => {
    patchAttrs(node);
    patchChildren(node);
    patchProperties(node);
    return node;
  };
}

export default MINI;
