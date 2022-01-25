export type TNameProp = {
  name: string;
}

export type TUrlProp = {
  url: string;
}

export type TNameUrlPair = TNameProp & TUrlProp;

export type TVersion = TNameUrlPair;
export type TGeneration = TNameUrlPair;
