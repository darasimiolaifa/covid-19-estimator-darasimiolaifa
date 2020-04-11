import challenge1 from './challenge1';
import challenge2 from './challenge2';
import challenge3 from './challenge3';

/**
 * This function time request object and calculates the number of days it translates into
 * @param {string} periodType one of `days`, `weeks`, and `months`
 * @param {number} timeToElapse the numeric quantifier of `periodType`
 * @returns {number} the number of days in the period indicated by the parameters of the function
 */
const convertRequestedTimeToDays = ({ periodType, timeToElapse }) => {
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

  return daysOfProjection;
};

/**
 * The entrypoint function for the COVID-19 estimator program.
 *
 * @param {Object} data the raw input data
 * @returns {Object} An object that contains the original input, and two other property objects:
 *    `impact: {
 *        currentlyInfected,
          infectionsByRequestedTime,
          severeCasesByRequestedTime,
          hospitalBedsByRequestedTime,
          casesForICUByRequestedTime,
          casesForVentilatorsByRequestedTime,
          dollarsInFlight
 *     },
 *      severeImpact: {
 *        currentlyInfected,
          infectionsByRequestedTime,
          severeCasesByRequestedTime,
          hospitalBedsByRequestedTime,
          casesForICUByRequestedTime,
          casesForVentilatorsByRequestedTime,
          dollarsInFlight
 *     }`
 */
const covid19ImpactEstimator = (data) => {
  const daysOfProjection = convertRequestedTimeToDays(data);
  const challenge1Output = challenge1(data, daysOfProjection);
  const challenge2Output = challenge2(challenge1Output);
  const finalEstimate = challenge3(challenge2Output, daysOfProjection);

  return {
    ...finalEstimate
  };
};

export default covid19ImpactEstimator;
