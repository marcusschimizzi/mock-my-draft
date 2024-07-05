export interface TeamNameLookup {
  abbreviation: string;
  location: string;
  nickname: string;
  fullName: string;
  id: string;
  division: 'east' | 'west' | 'north' | 'south';
  conference: 'afc' | 'nfc';
  colors: {
    primary: string;
    secondary: string;
    tertiary?: string;
    quaternary?: string;
    quinary?: string;
  };
}

export const TEAM_NAMES: TeamNameLookup[] = [
  {
    abbreviation: 'ari',
    location: 'arizona',
    nickname: 'cardinals',
    fullName: 'arizona cardinals',
    id: 'arizona-cardinals',
    division: 'west',
    conference: 'nfc',
    colors: {
      primary: '#97233F',
      secondary: '#000000',
    },
  },
  {
    abbreviation: 'atl',
    location: 'atlanta',
    nickname: 'falcons',
    fullName: 'atlanta falcons',
    id: 'atlanta-falcons',
    division: 'south',
    conference: 'nfc',
    colors: {
      primary: '#A71930',
      secondary: '#000000',
    },
  },
  {
    abbreviation: 'bal',
    location: 'baltimore',
    nickname: 'ravens',
    fullName: 'baltimore ravens',
    id: 'baltimore-ravens',
    division: 'north',
    conference: 'afc',
    colors: {
      primary: '#241773',
      secondary: '#000000',
    },
  },
  {
    abbreviation: 'buf',
    location: 'buffalo',
    nickname: 'bills',
    fullName: 'buffalo bills',
    id: 'buffalo-bills',
    division: 'east',
    conference: 'afc',
    colors: {
      primary: '#00338D',
      secondary: '#C60C30',
    },
  },
  {
    abbreviation: 'car',
    location: 'carolina',
    nickname: 'panthers',
    fullName: 'carolina panthers',
    id: 'carolina-panthers',
    division: 'south',
    conference: 'nfc',
    colors: {
      primary: '#0085CA',
      secondary: '#101820',
    },
  },
  {
    abbreviation: 'chi',
    location: 'chicago',
    nickname: 'bears',
    fullName: 'chicago bears',
    id: 'chicago-bears',
    division: 'north',
    conference: 'nfc',
    colors: {
      primary: '#0B162A',
      secondary: '#C83803',
    },
  },
  {
    abbreviation: 'cin',
    location: 'cincinnati',
    nickname: 'bengals',
    fullName: 'cincinnati bengals',
    id: 'cincinnati-bengals',
    division: 'north',
    conference: 'afc',
    colors: {
      primary: '#FB4F14',
      secondary: '#000000',
    },
  },
  {
    abbreviation: 'cle',
    location: 'cleveland',
    nickname: 'browns',
    fullName: 'cleveland browns',
    id: 'cleveland-browns',
    division: 'north',
    conference: 'afc',
    colors: {
      primary: '#311D00',
      secondary: '#FF3C00',
    },
  },
  {
    abbreviation: 'dal',
    location: 'dallas',
    nickname: 'cowboys',
    fullName: 'dallas cowboys',
    id: 'dallas-cowboys',
    division: 'east',
    conference: 'nfc',
    colors: {
      primary: '#041E42',
      secondary: '#869397',
    },
  },
  {
    abbreviation: 'den',
    location: 'denver',
    nickname: 'broncos',
    fullName: 'denver broncos',
    id: 'denver-broncos',
    division: 'west',
    conference: 'afc',
    colors: {
      primary: '#002244',
      secondary: '#FB4F14',
    },
  },
  {
    abbreviation: 'det',
    location: 'detroit',
    nickname: 'lions',
    fullName: 'detroit lions',
    id: 'detroit-lions',
    division: 'north',
    conference: 'nfc',
    colors: {
      primary: '#0076B6',
      secondary: '#B0B7BC',
    },
  },
  {
    abbreviation: 'gb',
    location: 'green bay',
    nickname: 'packers',
    fullName: 'green bay packers',
    id: 'green-bay-packers',
    division: 'north',
    conference: 'nfc',
    colors: {
      primary: '#203731',
      secondary: '#FFB612',
    },
  },
  {
    abbreviation: 'hou',
    location: 'houston',
    nickname: 'texans',
    fullName: 'houston texans',
    id: 'houston-texans',
    division: 'south',
    conference: 'afc',
    colors: {
      primary: '#03202F',
      secondary: '#A71930',
    },
  },
  {
    abbreviation: 'ind',
    location: 'indianapolis',
    nickname: 'colts',
    fullName: 'indianapolis colts',
    id: 'indianapolis-colts',
    division: 'south',
    conference: 'afc',
    colors: {
      primary: '#002C5F',
      secondary: '#A5ACAF',
    },
  },
  {
    abbreviation: 'jax',
    location: 'jacksonville',
    nickname: 'jaguars',
    fullName: 'jacksonville jaguars',
    id: 'jacksonville-jaguars',
    division: 'south',
    conference: 'afc',
    colors: {
      primary: '#006778',
      secondary: '#9F792C',
    },
  },
  {
    abbreviation: 'kc',
    location: 'kansas city',
    nickname: 'chiefs',
    fullName: 'kansas city chiefs',
    id: 'kansas-city-chiefs',
    division: 'west',
    conference: 'afc',
    colors: {
      primary: '#E31837',
      secondary: '#FFB81C',
    },
  },
  {
    abbreviation: 'lv',
    location: 'las vegas',
    nickname: 'raiders',
    fullName: 'las vegas raiders',
    id: 'las-vegas-raiders',
    division: 'west',
    conference: 'afc',
    colors: {
      primary: '#000000',
      secondary: '#A5ACAF',
    },
  },
  {
    abbreviation: 'lac',
    location: 'los angeles',
    nickname: 'chargers',
    fullName: 'los angeles chargers',
    id: 'los-angeles-chargers',
    division: 'west',
    conference: 'afc',
    colors: {
      primary: '#002A5E',
      secondary: '#FFC20E',
    },
  },
  {
    abbreviation: 'lar',
    location: 'los angeles',
    nickname: 'rams',
    fullName: 'los angeles rams',
    id: 'los-angeles-rams',
    division: 'west',
    conference: 'nfc',
    colors: {
      primary: '#002244',
      secondary: '#866D4B',
    },
  },
  {
    abbreviation: 'mia',
    location: 'miami',
    nickname: 'dolphins',
    fullName: 'miami dolphins',
    id: 'miami-dolphins',
    division: 'east',
    conference: 'afc',
    colors: {
      primary: '#008E97',
      secondary: '#F58220',
    },
  },
  {
    abbreviation: 'min',
    location: 'minnesota',
    nickname: 'vikings',
    fullName: 'minnesota vikings',
    id: 'minnesota-vikings',
    division: 'north',
    conference: 'nfc',
    colors: {
      primary: '#4F2683',
      secondary: '#FFC62F',
    },
  },
  {
    abbreviation: 'ne',
    location: 'new england',
    nickname: 'patriots',
    fullName: 'new england patriots',
    id: 'new-england-patriots',
    division: 'east',
    conference: 'afc',
    colors: {
      primary: '#002244',
      secondary: '#C60C30',
    },
  },
  {
    abbreviation: 'no',
    location: 'new orleans',
    nickname: 'saints',
    fullName: 'new orleans saints',
    id: 'new-orleans-saints',
    division: 'south',
    conference: 'nfc',
    colors: {
      primary: '#D3BC8D',
      secondary: '#101820',
    },
  },
  {
    abbreviation: 'nyg',
    location: 'new york',
    nickname: 'giants',
    fullName: 'new york giants',
    id: 'new-york-giants',
    division: 'east',
    conference: 'nfc',
    colors: {
      primary: '#0B2265',
      secondary: '#A71930',
    },
  },
  {
    abbreviation: 'nyj',
    location: 'new york',
    nickname: 'jets',
    fullName: 'new york jets',
    id: 'new-york-jets',
    division: 'east',
    conference: 'afc',
    colors: {
      primary: '#125740',
      secondary: '#000000',
    },
  },
  {
    abbreviation: 'phi',
    location: 'philadelphia',
    nickname: 'eagles',
    fullName: 'philadelphia eagles',
    id: 'philadelphia-eagles',
    division: 'east',
    conference: 'nfc',
    colors: {
      primary: '#004C54',
      secondary: '#A5ACAF',
    },
  },
  {
    abbreviation: 'pit',
    location: 'pittsburgh',
    nickname: 'steelers',
    fullName: 'pittsburgh steelers',
    id: 'pittsburgh-steelers',
    division: 'north',
    conference: 'afc',
    colors: {
      primary: '#FFB612',
      secondary: '#101820',
    },
  },
  {
    abbreviation: 'sf',
    location: 'san francisco',
    nickname: '49ers',
    fullName: 'san francisco 49ers',
    id: 'san-francisco-49ers',
    division: 'west',
    conference: 'nfc',
    colors: {
      primary: '#AA0000',
      secondary: '#B3995D',
    },
  },
  {
    abbreviation: 'sea',
    location: 'seattle',
    nickname: 'seahawks',
    fullName: 'seattle seahawks',
    id: 'seattle-seahawks',
    division: 'west',
    conference: 'nfc',
    colors: {
      primary: '#002244',
      secondary: '#69BE28',
    },
  },
  {
    abbreviation: 'tb',
    location: 'tampa bay',
    nickname: 'buccaneers',
    fullName: 'tampa bay buccaneers',
    id: 'tampa-bay-buccaneers',
    division: 'south',
    conference: 'nfc',
    colors: {
      primary: '#D50A0A',
      secondary: '#34302B',
    },
  },
  {
    abbreviation: 'ten',
    location: 'tennessee',
    nickname: 'titans',
    fullName: 'tennessee titans',
    id: 'tennessee-titans',
    division: 'south',
    conference: 'afc',
    colors: {
      primary: '#4B92DB',
      secondary: '#0C2340',
    },
  },
  {
    abbreviation: 'was',
    location: 'washington',
    nickname: 'commanders',
    fullName: 'washington commanders',
    id: 'washington-commanders',
    division: 'east',
    conference: 'nfc',
    colors: {
      primary: '#773141',
      secondary: '#FFC20E',
    },
  },
];

export function getInfoFromTeamId(teamId: string): TeamNameLookup | null {
  const teamInfo = TEAM_NAMES.find((team) => team.id === teamId);
  if (!teamInfo) {
    console.error(`Invalid team ID: ${teamId}`);
    return null;
  }
  return teamInfo;
}

export function getInfoFromTeamAbbreviation(
  abbreviation: string,
): TeamNameLookup | null {
  const teamInfo = TEAM_NAMES.find(
    (team) => team.abbreviation === abbreviation,
  );
  if (!teamInfo) {
    console.error(`Invalid team abbreviation: ${abbreviation}`);
    return null;
  }
  return teamInfo;
}
