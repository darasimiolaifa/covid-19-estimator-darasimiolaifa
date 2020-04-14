/**
 * This function receives the mild and severe estimates of current cases, and a number of days
 * to project over, and based on this number of days projects the number of expected cases by then
 * @param {number} leastProjectedInfections the mild projection of infections
 * @param {number} highestProjectedInfections the severe projection of infections
 * @param {number} avgDailyIncome the average daily income of population sample in USD
 * @param {number} avgDailyIncomePopulation the percentage of population that earns the average
 * daily income
 * @param {number} numOfDays the number of days to project over
 * @returns {Object} An object that contains the mild and severe projections of these properties:
      `impact: {
 *        casesForICUByRequestedTime,
          casesForVentilatorsByRequestedTime,
          dollarsInFlight
 *     },
 *      secureImpact: {
 *        casesForICUByRequestedTime,
          casesForVentilatorsByRequestedTime,
          dollarsInFlight
 *     }`
 */
const calculateProjectedICUAndVentilatorCasesWithDollarLoss = (
  leastProjectedInfections,
  highestProjectedInfections,
  avgDailyIncome,
  avgDailyIncomePopulation,
  numOfDays
) => {
  const leastICUCases = Math.trunc(leastProjectedInfections * 0.05);
  const highestICUCases = Math.trunc(highestProjectedInfections * 0.05);
  const leastVentilatorCases = Math.trunc(leastProjectedInfections * 0.02);
  const highestVentilatorCases = Math.trunc(highestProjectedInfections * 0.02);

  const dollarLoss = (avgDailyIncome * avgDailyIncomePopulation) / numOfDays;

  const leastDollarsInFlight = Math.trunc(
    leastProjectedInfections * dollarLoss
  );
  const highestDollarsInFlight = Math.trunc(
    highestProjectedInfections * dollarLoss
  );

  return {
    impact: {
      casesForICUByRequestedTime: leastICUCases,
      casesForVentilatorsByRequestedTime: leastVentilatorCases,
      dollarsInFlight: leastDollarsInFlight
    },
    severeImpact: {
      casesForICUByRequestedTime: highestICUCases,
      casesForVentilatorsByRequestedTime: highestVentilatorCases,
      dollarsInFlight: highestDollarsInFlight
    }
  };
};

/**
 * The entrypoint function for challenge one.
 *
 * @param {Object} data the updated input data, with the projected infections, critical cases,
 * and hospital bed availability already estimated
 * @param {number} projectedDays the number of days to project over for the estimation
 * @returns {Object} An object that contains the original input, with adittional estimates
 * of the ICU and ventilator needs, and the economic impact in terms of dollar loss for the
 * projected period
 */
export default (data, projectedDays) => {
  const {
    impact,
    severeImpact,
    data: {
      region: { avgDailyIncomeInUSD, avgDailyIncomePopulation }
    }
  } = data;

  const { infectionsByRequestedTime: leastProjectedInfections } = impact;
  const {
    infectionsByRequestedTime: highestProjectedInfections
  } = severeImpact;

  const ventilatorICUAndDollarLoss = calculateProjectedICUAndVentilatorCasesWithDollarLoss(
    leastProjectedInfections,
    highestProjectedInfections,
    avgDailyIncomeInUSD,
    avgDailyIncomePopulation,
    projectedDays
  );

  data.impact = { ...impact, ...ventilatorICUAndDollarLoss.impact };
  data.severeImpact = {
    ...severeImpact,
    ...ventilatorICUAndDollarLoss.severeImpact
  };

  return data;
};
