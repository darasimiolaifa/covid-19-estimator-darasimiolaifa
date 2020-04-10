const calculateInfectedCases = (reportedCases) => ({
  mildEstimates: reportedCases * 10,
  severeEstimates: reportedCases * 50
});

const calculateProjectedInfectedCases = (
  timeToElapse,
  periodType,
  mildCurrentEstimates,
  severeCurrentEstimates
) => {
  let daysOfProjection;

  switch (periodType) {
    case 'months':
      daysOfProjection = timeToElapse * 30;
      break;
    case 'weeks':
      daysOfProjection = timeToElapse * 7;
      break;
    default:
      daysOfProjection = timeToElapse;
      break;
  }
  const multiplier = 2 ** parseInt(daysOfProjection / 3, 10);
  return {
    mildProjections: mildCurrentEstimates * multiplier,
    severeProjections: severeCurrentEstimates * multiplier
  };
};

export default (data) => {
  console.log(data);
  const { reportedCases, timeToElapse, periodType } = data;
  const { mildEstimates, severeEstimates } = calculateInfectedCases(
    reportedCases
  );

  const {
    mildProjections,
    severeProjections
  } = calculateProjectedInfectedCases(
    timeToElapse,
    periodType,
    mildEstimates,
    severeEstimates
  );

  return {
    impact: {
      currentlyInfected: mildEstimates,
      infectionsByRequestedTime: mildProjections
    },
    severeImpact: {
      currentlyInfected: severeEstimates,
      infectionsByRequestedTime: severeProjections
    }
  };
};
