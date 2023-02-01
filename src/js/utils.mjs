// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}

export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const product = urlParams.get("product")
  return product
}

// function to take a list of objects and a template and insert the objects as HTML into the DOM
export function renderListWithTemplate(
  templateFn,
  parentElement,
  list,
  position = "afterbegin",
  clear = false
) {
  const htmlStrings = list.map(templateFn);
  // if clear is true we need to clear out the contents of the parent.
  if (clear) {
    parentElement.innerHTML = "";
  }
  parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}

export function getSuperscript(elementId) {
  let superscript = getLocalStorage("so-ss");
  const element = document.getElementById(elementId);
  const superscriptElement = document.createElement("div");
  superscriptElement.setAttribute("class", "ss-icon");
  superscriptElement.innerHTML = superscript;
  element.appendChild(superscriptElement);
}

export async function loadHeaderFooter() {
  let header = document.querySelector("header");
  const headerTemplate = await loadTemplate("../partials/header.html"); 
  renderWithTemplate(headerTemplate,header)
  
  const footerTemplate = await loadTemplate("../partials/footer.html");
  let footer = document.querySelector("footer");
  renderWithTemplate(footerTemplate,footer)
}


export function renderWithTemplate(template, parentElement, data, callback) {
  parentElement.insertAdjacentHTML("afterbegin", template);
  if(callback) {
      callback(data);
  }
}

async function loadTemplate(path) {
  let content = await fetch(path)
  let text = await content.text();
  return text
}
