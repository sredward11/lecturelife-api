const calculadora = require('.../src/index.js');

describe('Teste da Calculadora', () => {
    
 test('1 + 2 = 3', () => {
   expect(calculadora.soma(1, 2)).toBe(3);
 });
 test('1 * 0 = 0', () => {
   expect(calculadora.multiplicao(1, 0)).toEqual(0);
 });
 test('2 - 5 não é 3', () => {
   expect(calculadora.subtracao(2, 5)).not.toBe(3);
 });
 test('5 / 3 é aproximadamente 1.7', () => {
   expect(calculadora.divisao(5, 3)).toBeCloseTo(1.7, 1);
 });




test("se a e b < 0 ou a e b > 0 então a * b > 0", () => {
    expect(calculadora.multiplicacao).toBeDefined();
    expect(calculadora.multiplicacao(2, 2)).toBeDefined(0);
    expext(calculadora.multiplicacao(-2, 2)).toBeDefined(0);
});


test("se b = 0 então Divisao por ZERO", () => {
    expect(calculadora.divisao).toBeDefined();
    expect(() => calculadora.divisao(2, 0)).toThrow("Divisao por ZERO")
});



});