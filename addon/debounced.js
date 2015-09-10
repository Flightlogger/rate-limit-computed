import Ember from "ember";

const {
  run,
  computed
  } = Ember;

const {
  debounce,
  join,
  cancel
  } = run;

export default function debouncedProperty() {

  var args = [].slice.apply(arguments);
  var rate = args.pop();
  var method = args.pop();

  var __value = null;
  var __next = null;
  var __onDestroy = false;
  var __isNotifying = false;

  var methodFn = function(key) {

    if (!this.get('isDestroyed')) {
      if (!__isNotifying) {
        __isNotifying = true;
        __value = method.call(this, key);
        if (!this.get('isDestroying')) {
          join(this, this.propertyDidChange, key);
        }
      } else {
        __isNotifying = false;
      }
    }

  };

  args.push(function(key) {
    if (!__onDestroy) {
      var _super = this.willDestroy;
      this.willDestroy = function() {
        cancel(__next);
        _super();
      };
      __onDestroy = true;
    }
    __next = debounce(this, methodFn, key, rate, false);
    return __value;
  });
  return computed.apply(this, args);

}
