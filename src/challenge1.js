/**
 * This function receives the amount of reported cases, and gives both a mild
 * and severe estimate of the assumed actual cases
 * @param {number} reportedCases the number of days to project over for the estimation
 * @returns {Object} An object that contains the estimated cases:
 *    `{
 *       mildEstimates,
         severeEstimates
 *     }`
 */
const calculateInfectedCases = (reportedCases) => ({
  mildEstimates: reportedCases * 10,
  severeEstimates: reportedCases * 50
});

/**
 * This function receives the mild and severe estimates of current cases, and a number of days
 * to project over, and based on this number of days projects the number of expected cases by then
 * @param {number} daysOfProjection the number of days to project over for the estimation
 * @param {number} mildCurrentEstimates the current mild estimates of cases
 * @param {number} severeCurrentEstimates the current severe estimates of cases
 * @returns {Object} An object that contains the projected estimates for the future date:
 *    `{
 *       mildProjection,
         severeProjections
 *     }`
 */
const calculateProjectedInfectedCases = (
  daysOfProjection,
  mildCurrentEstimates,
  severeCurrentEstimates
) => {
  const multiplier = 2 ** Math.trunc(daysOfProjection / 3);
  return {
    mildProjections: mildCurrentEstimates * multiplier,
    severeProjections: severeCurrentEstimates * multiplier
  };
};

/**
 * The entrypoint function for challenge one.
 *
 * @param {Object} data the raw input data as sent to the covid19 estimator function
 * @param {number} daysOfProjection the number of days to project over for the estimation
 * @returns {Object} An object that contains the original input, and two other property objects:
 *    `impact: {
 *        currentlyInfected,
          infectionsByRequestedTime
 *     },
 *      severeImpact: {
 *        currentlyInfected,
          infectionsByRequestedTime
 *     }`
 */
export default (data, daysOfProjection) => {
  const { reportedCases } = data;
  const { mildEstimates, severeEstimates } = calculateInfectedCases(
    reportedCases
  );

  const {
    mildProjections,
    severeProjections
  } = calculateProjectedInfectedCases(
    daysOfProjection,
    mildEstimates,
    severeEstimates
  );

  return {
    ...data,
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
