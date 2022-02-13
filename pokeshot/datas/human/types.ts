type THumanExecute = 'getItem' | 'buttle' | 'recoverPokemon' | 'question';

type TTalk = string[];

type TQuestion = {
  selects: string[],
  result: {
    selects: string,
    execute?: THumanExecute,
    nextActionId?: string
  }[]
};

// [note]: いつか実装のため
type TButtle = any;

export type THumanAction = {
  actionId: string,
  talk?: TTalk,
  question?: TQuestion,
  execute?: THumanExecute,
  buttle?: TButtle,
  nextActionId?: string
}

export type THuman = {
  id: string,
  name: string,
  imagename: string,
  actions: THumanAction[],

};