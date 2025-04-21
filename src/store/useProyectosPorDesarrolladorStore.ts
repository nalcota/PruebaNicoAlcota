import { create } from 'zustand';

interface Proyecto {
  codigoProyecto: number;
  nombre: string;
  fechaInicio: string;
  fechaTermino: string;
  registroActivo: boolean;

}

interface ProyectosPorDesarrolladorState {
  proyectos: Proyecto[];
  setProyectos: (proyectos: Proyecto[]) => void;
}

export const useProyectosPorDesarrolladorStore = create<ProyectosPorDesarrolladorState>((set) => ({
  proyectos: [],
  setProyectos: (proyectos) => set({ proyectos }),
}));
