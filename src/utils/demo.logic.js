// src/utils/demo.logic.js
window.DemoLogic = {
  suma: function (a, b) {
    return (typeof a === 'number' && typeof b === 'number') ? a + b : NaN;
  }
};
