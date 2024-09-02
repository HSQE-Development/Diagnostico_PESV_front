import { MisionalitySizeCriteria } from "@/interfaces/Dedication";

export const determineCompanySize = (
  missionCriteria: MisionalitySizeCriteria[],
  totalVehicles: number,
  totalDrivers: number
): number | null => {
  let selectedSize: number | null = null;

  for (const criteria of missionCriteria) {
    const sizeCriteria = criteria.criteria_detail;

    // Handle undefined and null values for max properties
    const vehicleMax = sizeCriteria.vehicle_max ?? Infinity;
    const driverMax = sizeCriteria.driver_max ?? Infinity;

    // Check if the vehicle and driver counts are within the criteria ranges
    const vehicleInRange =
      sizeCriteria.vehicle_min <= totalVehicles && totalVehicles <= vehicleMax;
    const driverInRange =
      sizeCriteria.driver_min <= totalDrivers && totalDrivers <= driverMax;

    // Return the size ID if the criteria are met
    if (vehicleInRange && driverInRange) {
      return criteria.size_detail.id;
    }
    // Si al menos uno de los criterios se cumple, guardar temporalmente el tamaño
    if (vehicleInRange || driverInRange) {
      selectedSize = criteria.size_detail.id;
    }
  }

  // If no criteria are met, return null
  return selectedSize;
};
