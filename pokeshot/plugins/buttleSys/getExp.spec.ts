import { ButtleSystem } from "../buttleSys";

describe('ButtleSys.getExp()', () => {
  const buttleSys: ButtleSystem = new ButtleSystem();

  test('現在のレベルが3、相手のレベルが3、相手の基礎経験値が100の場合、計算結果は60を返す', () => {
    const result = buttleSys.getExp(3, 3, 100);
    expect(result).toBe(61);
  })

})