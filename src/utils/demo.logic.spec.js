// src/utils/demo.logic.spec.js
describe('DemoLogic.suma', function () {
  it('devuelve NaN si alguno no es número', function () {
    expect(isNaN(window.DemoLogic.suma(2, 'x'))).toBeTrue();
  });

  it('suma correctamente dos números', function () {
    expect(window.DemoLogic.suma(2, 3)).toBe(5);
  });
});
