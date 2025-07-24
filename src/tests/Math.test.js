// src/math.test.js

// Simple math functions to test
const add = (a, b) => a + b;
const multiply = (a, b) => a * b;
const divide = (a, b) => {
  if (b === 0) throw new Error("Cannot divide by zero");
  return a / b;
};

// Basic tests
describe("Math functions", () => {
  test("adds 1 + 2 to equal 3", () => {
    expect(add(1, 2)).toBe(3);
  });

  test("adds -1 + 1 to equal 0", () => {
    expect(add(-1, 1)).toBe(0);
  });

  test("multiplies 3 * 4 to equal 12", () => {
    expect(multiply(3, 4)).toBe(12);
  });

  test("divides 10 / 2 to equal 5", () => {
    expect(divide(10, 2)).toBe(5);
  });

  test("throws error when dividing by zero", () => {
    expect(() => divide(10, 0)).toThrow("Cannot divide by zero");
  });
});

// Test different Jest matchers
describe("Jest matchers", () => {
  test("two plus two is four", () => {
    expect(2 + 2).toBe(4);
  });

  test("object assignment", () => {
    const data = { one: 1 };
    data["two"] = 2;
    expect(data).toEqual({ one: 1, two: 2 });
  });

  test("null values", () => {
    const n = null;
    expect(n).toBeNull();
    expect(n).toBeDefined();
    expect(n).not.toBeUndefined();
    expect(n).not.toBeTruthy();
    expect(n).toBeFalsy();
  });

  test("zero values", () => {
    const z = 0;
    expect(z).not.toBeNull();
    expect(z).toBeDefined();
    expect(z).not.toBeUndefined();
    expect(z).not.toBeTruthy();
    expect(z).toBeFalsy();
  });

  test("string matchers", () => {
    expect("team").not.toMatch(/I/);
    expect("Christoph").toMatch(/stop/);
  });

  test("array matchers", () => {
    const shoppingList = [
      "diapers",
      "kleenex",
      "trash bags",
      "paper towels",
      "milk",
    ];

    expect(shoppingList).toContain("milk");
    expect(new Set(shoppingList)).toContain("milk");
  });
});
