const { readFile, writeFile } = require('fs').promises;

const teamsApiUrl = 'https://api.mockmydraft.com/api/teams';

const fetchTeams = async () => {
  const response = await fetch(teamsApiUrl);
  const teams = await response.json();
  return teams;
};

const acceptedPositions = [
  'QB',
  'RB',
  'FB',
  'WR',
  'TE',
  'T',
  'G',
  'C',
  'ED',
  'DI',
  'LB',
  'CB',
  'S',
  'K',
  'P',
];

// Map any old team names to their current names
const oldTeamNames = {
  'Washington Football Team': 'Washington Commanders',
  'Washington Redskins': 'Washington Commanders',
  'San Diego Chargers': 'Los Angeles Chargers',
  'St. Louis Rams': 'Los Angeles Rams',
  'Saint Louis Rams': 'Los Angeles Rams',
  'Oakland Raiders': 'Las Vegas Raiders',
};

const normalizeTeamName = (teamName) => {
  if (oldTeamNames[teamName]) {
    return oldTeamNames[teamName];
  }
  return teamName;
};

// Need to normalize positions, if listed position is not in the acceptedPositions array, then we need to map it to the correct position
const normalizePosition = (position) => {
  if (acceptedPositions.includes(position)) {
    return position;
  }

  // Map positions to the correct position
  const positionMap = {
    OT: 'T',
    OG: 'G',
    OC: 'C',
    DE: 'ED',
    DT: 'DI',
    NT: 'DI',
    ILB: 'LB',
    MLB: 'LB',
    OLB: 'ED',
    FS: 'S',
    SS: 'S',
  };
  return positionMap[position];
};

const getFilename = (year) => `data/${year}_draft_data.json`;

async function groupDraftClass(year) {
  // Read in the file
  const data = await readFile(getFilename(year), 'utf8');
  const draftPicks = JSON.parse(data);
  const teamDraftClasses = {};

  // Fetch the teams from the DB to get team IDs
  const teams = await fetchTeams();

  const getTeamId = (teamName) => {
    teamName = normalizeTeamName(teamName);
    const team = teams.find((team) => team.name === teamName);
    if (!team) {
      console.error(`Could not find team ${teamName}`);
      return null;
    }
    return team.id;
  };

  draftPicks.forEach((pick) => {
    if (!teamDraftClasses[pick.team]) {
      teamDraftClasses[pick.team] = [];
    }
    if (!pick.position) {
      // If the player does not have a position, it's likely a forfeited pick
      // Log it and we're not going to include it in the draft class
      console.log('No position for:', pick.player, pick.team, pick.pick);
    } else {
      teamDraftClasses[pick.team].push({
        year: year,
        pickNumber: pick.pick,
        round: pick.round,
        originalTeamId: getTeamId(pick.team),
        currentTeamId: getTeamId(pick.team),
        player: {
          name: pick.player,
          position: normalizePosition(pick.position),
          college: pick.college,
          dateOfBirth: pick.playerDetails.born,
          height: pick.playerDetails.height,
          weight: pick.playerDetails.weight,
          handSize: pick.playerDetails.handSize,
          armLength: pick.playerDetails.armLength,
          fortyYardDash: pick.playerDetails.fortyYardDash,
          tenYardSplit: pick.playerDetails.tenYardSplit,
          benchPress: pick.playerDetails.benchPress,
          verticalJump: pick.playerDetails.verticalJump,
          broadJump: pick.playerDetails.broadJump,
          threeConeDrill: pick.playerDetails.threeConeDrill,
          twentyYardShuttle: pick.playerDetails.twentyYardShuttle,
          twentyYardSplit: pick.playerDetails.twentyYardSplit,
          hometown: pick.playerDetails.hometown,
        },
      });
    }
  });

  const formattedDraftClasses = [];
  // Flatten the object into an array of what our API expects
  for (const team in teamDraftClasses) {
    const draftClass = teamDraftClasses[team];
    formattedDraftClasses.push({
      teamId: getTeamId(team),
      year: year,
      draftPicks: draftClass,
    });
  }

  // Write out the grouped data
  const outputFilename = `data/${year}_draft_classes.json`;
  await writeFile(
    outputFilename,
    JSON.stringify(formattedDraftClasses, null, 2),
  );
}

groupDraftClass(2024);
