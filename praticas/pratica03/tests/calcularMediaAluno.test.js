const { calcularMediaAluno } = require('../src/calcularMediaAluno');

describe('calcularMediaAluno', () => {

  test('se a calculadora está definida', () => {
    expect(calcularMediaAluno).toBeDefined();
  });

  test('se a1 ou a2 estiverem indefinidos', () => {
    expect(() => calcularMediaAluno(undefined, 8)).toThrow("Notas a1 ou a2 não informadas");
    expect(() => calcularMediaAluno(8, undefined)).toThrow("Notas a1 ou a2 não informadas");
  });

  test('se a1 ou a2 forem negativos', () => {
    expect(() => calcularMediaAluno(-1, 8)).toThrow("Notas a1 ou a2 não podem ser negativas");
    expect(() => calcularMediaAluno(8, -1)).toThrow("Notas a1 ou a2 não podem ser negativas");
  });

  test('cálculo base quando a3 não é informada', () => {
    expect(calcularMediaAluno(10, 8)).toBeCloseTo(8.8);
  });

  test('se a3 for negativa', () => {
    expect(() => calcularMediaAluno(8, 8, -1)).toThrow("Nota a3 não pode ser negativa");
  });

  test('se a melhor combinação é a1 e a3', () => {
    expect(calcularMediaAluno(10, 8, 9)).toBeCloseTo(9.4);
  });

  test('se a melhor combinação é a3 e a2', () => {
    expect(calcularMediaAluno(8, 10, 9)).toBeCloseTo(9.6);
  });
});