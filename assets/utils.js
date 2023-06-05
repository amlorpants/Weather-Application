// Generate an HTML component dynamically
export function createComponent(tagName, attributes, content) {
  var component = $('<' + tagName + '>', attributes);
  if (content) {
    component.html(content);
  }
  return component;
}

// Get the value of an input field
export function getInputValue(inputId) {
  return $(inputId).val();
}

// Hide an element by id
export function hide(element) {
  $(element).hide();
}

// Click event handler
export function onClick(element, callback) {
  $(element).on('click', callback);
}
