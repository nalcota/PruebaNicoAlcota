import { create } from 'zustand';

interface Proyecto {
  codigoDesarrollador: string;
  cantidadProyectos: number;
}

interface ProyectosState {
  proyectos: Proyecto[];
  setProyectos: (data: Proyecto[]) => void;
}

export const useProyectosPorDesarrolladorCantidadStore = create<ProyectosState>((set) => ({
  proyectos: [],  
  setProyectos: (data) => set({ proyectos: data }),  
}));
