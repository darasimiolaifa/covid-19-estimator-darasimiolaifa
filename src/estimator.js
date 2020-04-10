import challenge1 from './challenge1';
import challenge2 from './challenge2';
import testData from './testExample';

const covid19ImpactEstimator = (data) => {
  const challenge1Output = challenge1(data);
  const challenge2Output = challenge2(challenge1Output);

  return {
    ...challenge2Output
  };
};

console.log(covid19ImpactEstimator(testData));
export default covid19ImpactEstimator;
