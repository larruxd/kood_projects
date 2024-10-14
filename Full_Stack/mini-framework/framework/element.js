/**
 * Creates an HTML element with the specified type, properties, and children.
 * @param {string} type - The type of the HTML element to create.
 * @param {Object} props - The properties to set on the element.
 * @param {...(string|HTMLElement)} children - The children elements or text nodes to append to the element.
 * @returns {HTMLElement} The created HTML element.
 */
export function createElement(type, props = {}, ...children) {
  const element = document.createElement(type);

  // Set properties
  for (let [prop, value] of Object.entries(props)) {
    if (prop.startsWith('on')) {
      const eventName = prop.slice(2).toLowerCase();
      element.addEventListener(eventName, props[prop]);
    } else {
      element.setAttribute(prop, value);
    }
  }

  if (props && props['data-use-router']) {
    element.addEventListener('click', (e) => {
      e.preventDefault();
      history.pushState(null, '', props.href);
      window.dispatchEvent(new Event('navigate'));
    });
  }

  // Append children
  children.forEach((child) => {
    if (typeof child === 'string') {
      element.appendChild(document.createTextNode(child));
    } else if (child instanceof HTMLElement) {
      element.appendChild(child);
    }
  });

  return element;
}

export const elements = {
  div: (props, ...children) => createElement('div', props, ...children),
  span: (props, ...children) => createElement('span', props, ...children),
  h1: (props, ...children) => createElement('h1', props, ...children),
  h2: (props, ...children) => createElement('h2', props, ...children),
  h3: (props, ...children) => createElement('h3', props, ...children),
  h4: (props, ...children) => createElement('h4', props, ...children),
  h5: (props, ...children) => createElement('h5', props, ...children),
  h6: (props, ...children) => createElement('h6', props, ...children),
  p: (props, ...children) => createElement('p', props, ...children),
  a: (props, ...children) => createElement('a', props, ...children),
  ul: (props, ...children) => createElement('ul', props, ...children),
  ol: (props, ...children) => createElement('ol', props, ...children),
  li: (props, ...children) => createElement('li', props, ...children),
  img: (props, ...children) => createElement('img', props, ...children),
  button: (props, ...children) => createElement('button', props, ...children),
  input: (props, ...children) => createElement('input', props, ...children),
  form: (props, ...children) => createElement('form', props, ...children),
  label: (props, ...children) => createElement('label', props, ...children),
  select: (props, ...children) => createElement('select', props, ...children),
  option: (props, ...children) => createElement('option', props, ...children),
  textarea: (props, ...children) => createElement('textarea', props, ...children),
  table: (props, ...children) => createElement('table', props, ...children),
  thead: (props, ...children) => createElement('thead', props, ...children),
  tbody: (props, ...children) => createElement('tbody', props, ...children),
  section: (props, ...children) => createElement('section', props, ...children),
  header: (props, ...children) => createElement('header', props, ...children),
  footer: (props, ...children) => createElement('footer', props, ...children),
  tr: (props, ...children) => createElement('tr', props, ...children),
  th: (props, ...children) => createElement('th', props, ...children),
  td: (props, ...children) => createElement('td', props, ...children),
  i: (props, ...children) => createElement('i', props, ...children),
  b: (props, ...children) => createElement('b', props, ...children),
  br: (props, ...children) => createElement('br', props, ...children),
  hr: (props, ...children) => createElement('hr', props, ...children),
};
