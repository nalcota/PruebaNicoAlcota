import { create } from 'zustand';

interface Proyecto {
  codigoProyecto: string;
  cantidadDesarrolladores: number;
}

interface ProyectosState {
  proyectos: Proyecto[];
  setProyectos: (data: Proyecto[]) => void;
}

export const useProyectosPorDesarrolladorCantidadStore = create<ProyectosState>((set) => ({
  proyectos: [],  
  setProyectos: (data) => set({ proyectos: data }),  
}));
