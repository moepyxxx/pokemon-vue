import { ButtleSystem } from "../buttleSys";

describe('ButtleSys.saveExp()', () => {
  const buttleSys: ButtleSystem = new ButtleSystem();

  test(`
    ポケモンのレベルが5、現在の経験値合計が125、得た経験値が90だった場合
    レベルは上がらず、レベルは5、合計経験値は215が返却される
  `, () => {
    const argLevel = 5;
    const argCurrentExp = 125;
    const argExp = 90;
    const { level, isLevelUp, currentExp } = buttleSys.saveExp(argLevel, argCurrentExp, argExp);

    expect(level).toBe(5);
    expect(isLevelUp).toBe(false);
    expect(currentExp).toBe(215);
  })

  test(`
    ポケモンのレベルが5、現在の経験値合計が150、得た経験値が194だった場合
    レベルは上がり、レベルは7、合計経験値は344が返却される
  `, () => {
    const argLevel = 5;
    const argCurrentExp = 150;
    const argExp = 194;
    const { level, isLevelUp, currentExp } = buttleSys.saveExp(argLevel, argCurrentExp, argExp);

    expect(level).toBe(7);
    expect(isLevelUp).toBe(true);
    expect(currentExp).toBe(344);
  })

  test(`
    ポケモンのレベルが99、現在の経験値合計が980299、得た経験値が50000だった場合
    レベルは上がり、レベルは100、合計経験値は1000000が返却される
  `, () => {
    const argLevel = 99;
    const argCurrentExp = 980299;
    const argExp = 50000;
    const { level, isLevelUp, currentExp } = buttleSys.saveExp(argLevel, argCurrentExp, argExp);

    expect(level).toBe(100);
    expect(isLevelUp).toBe(true);
    expect(currentExp).toBe(1000000);
  })

})
