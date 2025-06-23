import { useEffect, useState } from "react";
import axios from "axios";

export default function useDynamicSelect<T>(
  endpoint: string,
  dependencyValue: string | number | null | undefined
) {
  const [options, setOptions] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (dependencyValue) {
      setLoading(true);
      axios
        .get(`${endpoint}${dependencyValue}`)
        .then((res) => {
          if (res && res.data) {
            setOptions(Array.isArray(res.data) ? (res.data as T[]) : []);
          } else {
            setOptions([]);
          }
        })
        .catch((err) => console.error("Error cargando datos:", err))
        .then(() => setLoading(false)); // compatible con todas versiones
    } else {
      setOptions([]);
    }
  }, [dependencyValue]);

  return { options, loading };
}
