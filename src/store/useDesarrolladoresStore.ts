import { create } from 'zustand';

interface Desarrollador {
  id: number;
  nombre: string;
  rut: string;
  correo: string;
  fechaContratacion: string;
  añosExperiencia: number;
  proyectosAsignados: number;
  estado: string;
}

interface DesarrolladoresState {
  desarrolladores: Desarrollador[];
  setDesarrolladores: (data: Desarrollador[]) => void;
  
}

export const useDesarrolladoresStore = create<DesarrolladoresState>((set) => ({
  desarrolladores: [],
  setDesarrolladores: (data) => set({ desarrolladores: data }),
}));
