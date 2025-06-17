export type State = 'PENDIENTE' | 'EN_CURSO' | 'CANCELADO' | 'TERMINADO';

export interface Project {
  id?: number;
  name: string;
  description: string;
  state: State;
}
