// src/store/useProyectosStore.ts
import { create } from 'zustand';

interface Proyecto {
  id: number;
  nombre: string;
  descripcion: string;
  fechaInicio: string;
  fechaFin: string;
  estado: string;
}

interface ProyectosState {
  proyectos: Proyecto[];
  setProyectos: (data: Proyecto[]) => void;
}

export const useProyectosStore = create<ProyectosState>((set) => ({
  proyectos: [],
  setProyectos: (data) => set({ proyectos: data }),
}));
