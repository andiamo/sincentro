function indexOf(needle) {
  // Per spec, the way to identify NaN is that it is not equal to itself
  let findNaN = needle !== needle;
  let fun;

  if (!findNaN && typeof Array.prototype.indexOf === 'function') {
    fun = Array.prototype.indexOf;
  } else {
    fun = function(needle) {
        let i = -1, index = -1;

      for (i = 0; i < this.length; i++) {
        let item = this[i];

        if ((findNaN && item !== item) || item === needle) {
          index = i;
          break;
        }
      }

      return index;
    };
  }

  return fun.call(this, needle)
}

function removeAll(items, toRemove) {
  for (let i = 0; i < toRemove.length; i++) {
    let idx = toRemove[i];
    items.splice(idx, 1);
  }
}