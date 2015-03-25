// See http://davidwalsh.name/javascript-debounce-function
export default function debounce(fn, wait, thisArg) {
  let timeout;
  return function() {
    let context = this, args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      timeout = null;
      fn.apply(thisArg || context, args);
    }, wait);
  };
}
