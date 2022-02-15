type THumanExecute = 'talk' | 'getItem' | 'buttle' | 'recoverPokemon' | 'question';

type TSystemExecute = 'report';

type TTalk = string[];

type TQuestion = {
  select: string,
  execute?: THumanExecute,
  nextActionId?: string
};

// [note]: いつか実装のため
type TButtle = any;

export type THumanAction = {
  actionId: string,
  talk?: TTalk,
  questions?: TQuestion[],
  execute: THumanExecute | TSystemExecute,
  buttle?: TButtle,
  nextActionId?: string
}

export type THuman = {
  id: string,
  name: string,
  imagename: string,
  actions: THumanAction[],

};