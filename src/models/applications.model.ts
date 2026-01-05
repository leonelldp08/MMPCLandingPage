export interface Applications {
  id: number;
  name: string;
  description: string;
}

export function createEmptyApplication(id: number): Applications {
  return {
    id: id,
    name: '',
    description: '',
  };
}
