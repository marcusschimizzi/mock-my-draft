const { readFile, writeFile } = require('fs').promises;

const getFilename = (year) => `data/${year}_draft_data.json`;

async function groupDraftClass(year) {
  // Read in the file
  const data = await readFile(getFilename(year), 'utf8');
  const draftPicks = JSON.parse(data);
  const teamDraftClasses = {};
  draftPicks.forEach((pick) => {
    if (!teamDraftClasses[pick.team]) {
      teamDraftClasses[pick.team] = [];
    }
    teamDraftClasses[pick.team].push({
      year: year,
      pickNumber: pick.pick,
      round: pick.round,
      team: pick.team,
      player: {
        name: pick.player,
        position: pick.position,
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
  });

  // Write out the grouped data
  const outputFilename = `data/${year}_draft_classes.json`;
  await writeFile(outputFilename, JSON.stringify(teamDraftClasses, null, 2));
}

groupDraftClass(2024);
