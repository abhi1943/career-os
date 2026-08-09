import { useMemo } from "react";
import { getCareerCompleteData } from "../utils/careerDataMapper";

function useCareerData(careerId) {
  const careerData = useMemo(() => {
    return getCareerCompleteData(careerId);
  }, [careerId]);

  return careerData;
}

export default useCareerData;