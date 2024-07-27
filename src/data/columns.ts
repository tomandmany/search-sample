export const participantColumns = [
  { header: '団体名', property: 'participantName' },
  { header: 'フリガナ', property: 'ruby' },
  { header: 'SNSアカウント', property: 'socialMedia' },
];

const commonProgramColumns = [
  { header: '企画名', property: 'programName' },
  { header: 'キャッチフレーズ', property: 'catchphrase' },
  { header: '企画内容', property: 'details' },
  { header: 'ジャンル', property: 'genre' },
  { header: '企画イメージ図', property: 'image' },
  // { header: '開始時間', property: 'startTime' },
  // { header: '終了時間', property: 'endTime' },
  // { header: '公開日', property: 'releaseDate' },
];

export const boothProgramColumns = [
  ...commonProgramColumns,
  { header: '企画区分', property: 'categoryType' },
  { header: 'ドリンクの販売の有無', property: 'isDrinkAvailable' },
  { header: 'エコトレー利用の有無', property: 'isEcoTrayUsed' },
];

export const outstageProgramColumns = [
  ...commonProgramColumns,
  { header: '実施場所', property: 'venue' },
  { header: '企画実施日', property: 'eventDate' },
  { header: '撮影の可否', property: 'photographPermission' },
];

export const roomProgramColumns = [
  ...commonProgramColumns,
  { header: '企画実施校舎', property: 'eventBuilding' },
  { header: '企画実施教室', property: 'eventRoom' },
  { header: '企画実施日', property: 'eventDate' },
  { header: '撮影の可否', property: 'photographPermission' },
  { header: 'チケットの有無', property: 'isEventTicketAvailable' },
  { header: '整理券の有無', property: 'isReservationRequired' },
  { header: '物品販売の有無', property: 'isGoodsAvailable' },
  { header: 'エコトレー利用の有無', property: 'isEcoTrayUsed' },
];