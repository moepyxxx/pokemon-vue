import IHandPokemon from "~/interface/IHandPokemon";
import IOnButtle from "~/interface/IOnButtle";
import IWildPokemon from "~/interface/IWildPokemon";
import { ButtleSystem, TBehave } from "../buttleSys";
import _ from 'lodash';

describe('ButtleSys.checkPriority()', () => {
  const buttleSys: ButtleSystem = new ButtleSystem();

  const movePriorityDefault = 0;
  const speedDefault = 50;

  const behavor: (IHandPokemon|IWildPokemon) & IOnButtle = {
    base: {
      name: 'アチャモ',
      id: 255,
      gender: 'オス',
      type: ['water'],
      imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/255.png'
    },
    stats: {
      hp: 45,
      attack: 60,
      defense: 40,
      specialAttack: 70,
      specialDefense: 50,
      speed: speedDefault
    },
    remainHp: 45,
    moves:[{
      id: 1,
      name: 'たいあたり',
      accuracy: 80,
      pp: 40,
      priority: movePriorityDefault,
      power: 50,
      type: 'normal'
    }],
    baseExperience: 62,
    currentExp: 5,
    level: 125,
    individualStats:15,
    effortStats: 0,
    nickname: 'アチャモ',
    statusAilment: null,
    battleStatusRank: {
      attack: 0,
      defense: 0,
      specialAttack: 0,
      specialDefense: 0,
      rapidity: 0,
      critical: 0,
      accuracy: 0,
      evasion: 0
    }
  }

  const behavorBehave: TBehave = {
    buttlePokemon: 'opponent',
    action: 'attack',
    pokemon: behavor,
    target: behavor,
    move: behavor.moves[0]
  }

  const opponentBehave = _.cloneDeep(behavorBehave);
  const onHandBehave = _.cloneDeep(behavorBehave);

  test(`
    自分のわざの優先度が0で、相手のわざの優先度が1のとき、相手の値が戻り値の0番目に登録される
    （引数をonHand / opponentの順で入れる）
  `, () => {
    const onHandMovePriority = 0;
    const opponentMovePriority = 1;

    onHandBehave.move.priority = onHandMovePriority;
    opponentBehave.move.priority = opponentMovePriority;

    const checked: TBehave[] = buttleSys.checkPriority([onHandBehave, opponentBehave]);
    expect(checked[0]).toEqual(opponentBehave);
  })

  test(`
    自分のわざの優先度が0で、相手のわざの優先度が1のとき、相手の値が戻り値の0番目に登録される
    （引数をopponent / onHandの順で入れる）
  `, () => {
    const onHandMovePriority = 0;
    const opponentMovePriority = 1;

    onHandBehave.move.priority = onHandMovePriority;
    opponentBehave.move.priority = opponentMovePriority;

    const checked: TBehave[] = buttleSys.checkPriority([opponentBehave, onHandBehave]);
    expect(checked[0]).toEqual(opponentBehave);
  })

  test(`
    自分のわざの優先度が0で、相手のわざの優先度も0であり、
    自分のすばやさが50で、相手の素早さが60のとき
    相手の値が戻り値の0番目に登録される
  `, () => {
    const onHandMovePriority = 0;
    const opponentMovePriority = 0;
    onHandBehave.move.priority = onHandMovePriority;
    opponentBehave.move.priority = opponentMovePriority;
    
    const onHandSpeed = 50;
    const opponentSpeed = 60;
    onHandBehave.pokemon.stats.speed = onHandSpeed;
    opponentBehave.pokemon.stats.speed = opponentSpeed;
    
    const checked: TBehave[] = buttleSys.checkPriority([onHandBehave, opponentBehave]);
    expect(checked[0]).toEqual(opponentBehave);
  })

  test(`
    自分のわざの優先度が0で、相手のわざの優先度も0であり、
    自分のすばやさが50で、相手のすばやさも50であり、
    ランダムな関数の結果0が出たときには
    相手の値が戻り値の0番目に登録される
  `, () => {
    const onHandMovePriority = 0;
    const opponentMovePriority = 0;
    onHandBehave.move.priority = onHandMovePriority;
    opponentBehave.move.priority = opponentMovePriority;
    
    const onHandSpeed = 50;
    const opponentSpeed = 50;
    onHandBehave.pokemon.stats.speed = onHandSpeed;
    opponentBehave.pokemon.stats.speed = opponentSpeed;

    jest.spyOn(buttleSys, 'getRandNum').mockImplementation(() => 0);
    
    const checked: TBehave[] = buttleSys.checkPriority([onHandBehave, opponentBehave]);
    
    expect(checked[0]).toEqual(opponentBehave);
  })

})