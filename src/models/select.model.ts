export interface SelectProperty {
  label: string;
  value: any;
}

export function createVoterTypeOptions(): SelectProperty[] {
  return [
    { label: 'Voter', value: 'voter' },
    { label: 'Adminsitrator', value: 'administrator' }
  ];
}
