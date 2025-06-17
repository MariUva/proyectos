export type TaskState = 'PENDIENTE' | 'EN_CURSO' | 'CANCELADO' | 'TERMINADO';

export interface Task {
  id?: number;
  title: string;
  description: string;
  completed: boolean;
  state: TaskState;
  projectId: number;
}
