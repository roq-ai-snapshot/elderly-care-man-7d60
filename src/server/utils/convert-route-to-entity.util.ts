const mapping: Record<string, string> = {
  allergies: 'allergy',
  appointments: 'appointment',
  'care-homes': 'care_home',
  'care-plans': 'care_plan',
  caregivers: 'caregiver',
  medications: 'medication',
  residents: 'resident',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
