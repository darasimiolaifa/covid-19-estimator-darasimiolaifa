const calculateProjectedSevereCases = (impact, severeImpact) => {
  const { infectionsByRequestedTime: mildProjections } = impact;
  const { infectionsByRequestedTime: severeProjections } = severeImpact;

  impact.severeCasesByRequestedTime = mildProjections * 0.15;
  severeImpact.severeCasesByRequestedTime = severeProjections * 0.15;

  return { impact, severeImpact };
};

const calculateProjectedBedAvailability = (
  totalHospitalBeds,
  { impact, severeImpact }
) => {
  const { severeCasesByRequestedTime: mildProjectionofCases } = impact;
  const { severeCasesByRequestedTime: severeProjectionOfCases } = severeImpact;

  const currentlyAvailableBeds = Math.ceil(totalHospitalBeds * 0.35);

  const bestCaseScenario = currentlyAvailableBeds - mildProjectionofCases;
  const worstCaseScenario = currentlyAvailableBeds - severeProjectionOfCases;

  impact.hospitalBedsByRequestedTime = bestCaseScenario;
  severeImpact.hospitalBedsByRequestedTime = worstCaseScenario;

  return { impact, severeImpact };
};

export default (estimate) => {
  const { impact, severeImpact, totalHospitalBeds } = estimate;
  const projectedSevereCases = calculateProjectedSevereCases(
    impact,
    severeImpact
  );
  const projectedBedAvailabilty = calculateProjectedBedAvailability(
    totalHospitalBeds,
    projectedSevereCases
  );

  estimate.impact = projectedBedAvailabilty.impact;
  estimate.severeImpact = projectedBedAvailabilty.severeImpact;

  return estimate;
};
