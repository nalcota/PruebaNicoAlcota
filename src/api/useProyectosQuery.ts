import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useProyectosStore } from '../store/useProyectosStore';

const API_URL = 'https://apipruebas.rbu.cl/api/proyectos';
const TOKEN = 'T7fZ9gHj5KmN2pQr8sV3uW6xY1zA4bC0dE7fG9hJ2kL4mN6pQ8rS0tV3wX5yZ7aC9';

export const useProyectosQuery = () => {
  const setProyectos = useProyectosStore((state) => state.setProyectos);

  return useQuery({
    queryKey: ['proyectos'],
    queryFn: async () => {
      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      });
      setProyectos(response.data);
      return response.data;
    },
  });
};
