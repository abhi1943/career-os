import { useMemo } from "react";
import { getCareerCompleteData } from "../utils/careerDataMapper";

function useCareerData(careerId) {
  const careerData = useMemo(() => {
    if (!careerId) return null;

    return getCareerCompleteData(careerId);
  }, [careerId]);

  return careerData;
}

export default useCareerData;