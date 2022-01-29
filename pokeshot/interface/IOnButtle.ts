type TBattleStatusRank = {
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
  rapidity: number;
  critical: number;
  accuracy: number;
  evasion: number;
}

export type TStatusAilment = 'paralysis' | 'sleep' | 'freeze' | 'burn' | 'poison' |
                      'confusion' | 'infatuation' | 'trap' | 'nightmare' | 'disable' |
                      'yawn' | 'heal-block' | 'no-type-immunity' | 'leech-seed' |
                      'embargo' | 'perish-song' | 'ingrain' | 'silence' | 'tar-shot';

interface IOnButtle {
  
  // バトルステータスランク
  battleStatusRank: TBattleStatusRank;

}
export default IOnButtle;