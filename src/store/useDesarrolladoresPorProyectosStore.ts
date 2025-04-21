import { create } from 'zustand';

interface Desarrollador {
  codigoDesarrollador: number;
  nombre: string;
  rut: string;
  correoElectronico: string;
  fechaContratacion: string;
  aniosExperiencia: number;
  registroActivo: boolean;
}

interface Proyecto {
  codigoProyecto: number;
  nombre: string;
  desarrolladores: Desarrollador[];
}

interface ProyectosYDesarrolladoresState {
  proyectos: Proyecto[];
  setProyectos: (proyectos: Proyecto[]) => void;
}

export const useProyectosYDesarrolladoresStore = create<ProyectosYDesarrolladoresState>((set) => ({
  proyectos: [],
  setProyectos: (proyectos) => set({ proyectos }),
}));
