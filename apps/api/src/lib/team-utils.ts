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
  logo: string;
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
    logo: 'https://upload.wikimedia.org/wikipedia/en/7/72/Arizona_Cardinals_logo.svg',
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
    logo: 'https://upload.wikimedia.org/wikipedia/en/c/c5/Atlanta_Falcons_logo.svg',
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
    logo: 'https://upload.wikimedia.org/wikipedia/en/1/16/Baltimore_Ravens_logo.svg',
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
    logo: 'https://upload.wikimedia.org/wikipedia/en/7/77/Buffalo_Bills_logo.svg',
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
    logo: 'https://upload.wikimedia.org/wikipedia/en/1/1c/Carolina_Panthers_logo.svg',
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
    logo: 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Chicago_Bears_logo.svg',
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
    logo: 'https://upload.wikimedia.org/wikipedia/commons/8/81/Cincinnati_Bengals_logo.svg',
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
    logo: 'https://upload.wikimedia.org/wikipedia/en/d/d9/Cleveland_Browns_logo.svg',
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
    logo: 'https://upload.wikimedia.org/wikipedia/commons/1/15/Dallas_Cowboys.svg',
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
    logo: 'https://upload.wikimedia.org/wikipedia/en/4/44/Denver_Broncos_logo.svg',
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
    logo: 'https://upload.wikimedia.org/wikipedia/en/7/71/Detroit_Lions_logo.svg',
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
    logo: 'https://upload.wikimedia.org/wikipedia/commons/5/50/Green_Bay_Packers_logo.svg',
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
    logo: 'https://upload.wikimedia.org/wikipedia/en/2/28/Houston_Texans_logo.svg',
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
    logo: 'https://upload.wikimedia.org/wikipedia/commons/0/00/Indianapolis_Colts_logo.svg',
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
    logo: 'https://upload.wikimedia.org/wikipedia/en/7/74/Jacksonville_Jaguars_logo.svg',
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
    logo: 'https://upload.wikimedia.org/wikipedia/en/e/e1/Kansas_City_Chiefs_logo.svg',
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
    logo: 'https://upload.wikimedia.org/wikipedia/en/4/48/Las_Vegas_Raiders_logo.svg',
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
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Los_Angeles_Chargers_logo.svg',
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
    logo: 'https://upload.wikimedia.org/wikipedia/en/8/8a/Los_Angeles_Rams_logo.svg',
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
    logo: 'https://upload.wikimedia.org/wikipedia/en/3/37/Miami_Dolphins_logo.svg',
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
    logo: 'https://upload.wikimedia.org/wikipedia/en/4/48/Minnesota_Vikings_logo.svg',
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
    logo: 'https://upload.wikimedia.org/wikipedia/en/b/b9/New_England_Patriots_logo.svg',
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
    logo: 'https://upload.wikimedia.org/wikipedia/commons/5/50/New_Orleans_Saints_logo.svg',
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
    logo: 'https://upload.wikimedia.org/wikipedia/commons/6/60/New_York_Giants_logo.svg',
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
    logo: 'https://upload.wikimedia.org/wikipedia/commons/6/69/New_York_Jets_2024.svg',
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
    logo: 'https://upload.wikimedia.org/wikipedia/en/8/8e/Philadelphia_Eagles_logo.svg',
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
    logo: 'https://upload.wikimedia.org/wikipedia/commons/d/de/Pittsburgh_Steelers_logo.svg',
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
    logo: 'https://upload.wikimedia.org/wikipedia/commons/3/3a/San_Francisco_49ers_logo.svg',
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
    logo: 'https://upload.wikimedia.org/wikipedia/en/8/8e/Seattle_Seahawks_logo.svg',
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
    logo: 'https://upload.wikimedia.org/wikipedia/en/a/a2/Tampa_Bay_Buccaneers_logo.svg',
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
    logo: 'https://upload.wikimedia.org/wikipedia/en/c/c1/Tennessee_Titans_logo.svg',
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
    logo: 'https://upload.wikimedia.org/wikipedia/commons/0/0c/Washington_Commanders_logo.svg',
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
