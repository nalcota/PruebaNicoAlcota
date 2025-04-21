import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useProyectosPorDesarrolladorStore } from '../store/useProyectosPorDesarrolladorStore';

const API_URL = 'https://apipruebas.rbu.cl/api/desarrolladores';
const TOKEN = 'T7fZ9gHj5KmN2pQr8sV3uW6xY1zA4bC0dE7fG9hJ2kL4mN6pQ8rS0tV3wX5yZ7aC9';

export const useProyectosPorDesarrolladorQuery = () => {
    const setProyectos = useProyectosPorDesarrolladorStore((state) => state.setProyectos);
  
    return useQuery({
      queryKey: ['proyectosPorDesarrollador2'],
      queryFn: async () => {
        const desarrolladoresResponse = await axios.get(API_URL, {
          headers: { Authorization: `Bearer ${TOKEN}` },
        });
  
        const desarrolladores = desarrolladoresResponse.data;
  
        const proyectosPorDesarrollador = await Promise.all(
          desarrolladores.map(async (dev: { codigoDesarrollador: number }) => {
            const proyectosResponse = await axios.get(
              `${API_URL}/${dev.codigoDesarrollador}/proyectos`,
              {
                headers: { Authorization: `Bearer ${TOKEN}` },
              }
            );
  
            return {
              codigoDesarrollador: dev.codigoDesarrollador,
              proyectos: proyectosResponse.data,
            };
          })
        );
  
        setProyectos(proyectosPorDesarrollador);
        return proyectosPorDesarrollador;
      },
    });
  };
  