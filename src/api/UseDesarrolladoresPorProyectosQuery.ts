// src/hooks/useProyectosYDesarrolladoresQuery.ts
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useProyectosYDesarrolladoresStore } from '../store/useDesarrolladoresPorProyectosStore';

const API_URL = 'https://apipruebas.rbu.cl/api/proyectos';
const TOKEN = 'T7fZ9gHj5KmN2pQr8sV3uW6xY1zA4bC0dE7fG9hJ2kL4mN6pQ8rS0tV3wX5yZ7aC9';

export const useDesarrolladoresPorProyectosQuery = () => {
  const setProyectos = useProyectosYDesarrolladoresStore((state) => state.setProyectos);

  return useQuery({
    queryKey: ['proyectosYDesarrolladores'],
    queryFn: async () => {
      const proyectosResponse = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${TOKEN}` },
      });

      const proyectos = proyectosResponse.data;

      const proyectosConDesarrolladores = await Promise.all(
        proyectos.map(async (proyecto: { codigoProyecto: number }) => {
          const desarrolladoresResponse = await axios.get(
            `${API_URL}/${proyecto.codigoProyecto}/desarrolladores`,
            {
              headers: { Authorization: `Bearer ${TOKEN}` },
            }
          );

          return {
            ...proyecto,
            desarrolladores: desarrolladoresResponse.data,
          };
        })
      );

      setProyectos(proyectosConDesarrolladores); 
      return proyectosConDesarrolladores;
    },
  });
};
