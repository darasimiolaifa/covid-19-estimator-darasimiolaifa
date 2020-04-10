/**
 * This function receives the already projected infections estimates, both for the mild and severe
 * cases, and estimates what percent of that would have become critical by the given date
 * @param {Object} impact An object containing mild projected number of cases for a given future
 * date
 * @param {Object} severeImpact An object containing severe projected number of cases for a given
 * future date
 * @returns {Object} An object that contains the original arguments with an addtional
 * `severeCasesByRequestedTime` property
 */
const calculateProjectedSevereCases = (impact, severeImpact) => {
  const { infectionsByRequestedTime: mildProjections } = impact;
  const { infectionsByRequestedTime: severeProjections } = severeImpact;

  impact.severeCasesByRequestedTime = mildProjections * 0.15;
  severeImpact.severeCasesByRequestedTime = severeProjections * 0.15;

  return { impact, severeImpact };
};

/**
 * This function receives the already projected severe cases estimates, both for the mild and severe
 * cases, and estimates the amount of hospital beds that would be available by the projected date
 * @param {Object} impact An object containing mild projected number of severe cases for a given
 * future date
 * @param {Object} severeImpact An object containing severe projected number of severe cases for a
 * given future date
 * @returns {Object} An object that contains the original arguments with an addtional
 * `hospitalBedsByRequestedTime` property
 */
const calculateProjectedBedAvailability = (
  totalHospitalBeds,
  { impact, severeImpact }
) => {
  const { severeCasesByRequestedTime: mildProjectionofCases } = impact;
  const { severeCasesByRequestedTime: severeProjectionOfCases } = severeImpact;

  const currentlyAvailableBeds = totalHospitalBeds * 0.35;

  const bestCaseScenario = currentlyAvailableBeds - mildProjectionofCases;
  const worstCaseScenario = currentlyAvailableBeds - severeProjectionOfCases;

  impact.hospitalBedsByRequestedTime = Math.trunc(bestCaseScenario);
  severeImpact.hospitalBedsByRequestedTime = Math.trunc(worstCaseScenario);

  return { impact, severeImpact };
};

/**
 * The entrypoint function for challenge one.
 *
 * @param {Object} data the updated input data, with the projected infections by a future date
 * already estimated
 * @returns {Object} An object that contains the original properties, but extended with now
 * projected amount of severe cases and available hospital beds at the future date
 */
export default (data) => {
  const { impact, severeImpact, totalHospitalBeds } = data;
  const projectedSevereCases = calculateProjectedSevereCases(
    impact,
    severeImpact
  );
  const projectedBedAvailabilty = calculateProjectedBedAvailability(
    totalHospitalBeds,
    projectedSevereCases
  );

  data.impact = projectedBedAvailabilty.impact;
  data.severeImpact = projectedBedAvailabilty.severeImpact;

  return data;
};
