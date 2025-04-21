import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useProyectosPorDesarrolladorCantidadStore } from '../store/useProyectosPorDesarrolladorCantidadStore';

const API_URL = 'https://apipruebas.rbu.cl/api/proyectos';
const TOKEN = 'T7fZ9gHj5KmN2pQr8sV3uW6xY1zA4bC0dE7fG9hJ2kL4mN6pQ8rS0tV3wX5yZ7aC9';

export const useDesarrolladoresPorProyectoCantidadQuery = () => {
  const setProyectos = useProyectosPorDesarrolladorCantidadStore((state) => state.setProyectos);

  return useQuery({
    queryKey: ['desarrolladoresPorProyecto'],
    queryFn: async () => {
      const proyectosResponse = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${TOKEN}` },
      });

      const proyectos = proyectosResponse.data;

      const desarrolladoresPorProyecto = await Promise.all(
        proyectos.map(async (proyecto: { codigoProyecto: string }) => {
          const desarrolladoresResponse = await axios.get(
            `${API_URL}/${proyecto.codigoProyecto}/desarrolladores`,
            {
              headers: { Authorization: `Bearer ${TOKEN}` },
            }
          );

          return {
            codigoProyecto: proyecto.codigoProyecto,
            cantidadDesarrolladores: desarrolladoresResponse.data.length,
          };
        })
      );

      setProyectos(desarrolladoresPorProyecto);
      return desarrolladoresPorProyecto;
    },
  });
};
