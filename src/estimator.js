import challenge1 from './challenge1';

const covid19ImpactEstimator = (data) => {
  const outputData = challenge1(data);
  console.log(outputData);

  return {
    data,
    ...outputData
  };
};

export default covid19ImpactEstimator;
