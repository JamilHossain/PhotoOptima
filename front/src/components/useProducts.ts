/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useCallback } from "react";

export const useProducts = (url: string) => {
  const [data, setData] = useState<
    {
      product_id: any;
      id: any;
      src: any;
      created_at: any;
      done: any;
    }[]
  >([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const doFetching = useCallback(() => {
    setLoading(true);
    fetch(`${url}/allproducts`)
      .then((response) => response.json())
      .then(async (response) => {
        const serverFlags = response.serverFlags;
        const ourMap = new Map<string, boolean>();
        for (let i = 0; i < serverFlags.length; i++) {
          ourMap.set(serverFlags[i].img_id, true);
        }
        const allpro: any = response.products;
        const alldata: {
          product_id: any;
          id: any;
          src: any;
          created_at: any;
          done: any;
        }[] = [];
        for (let i = 0; i < allpro.length; i++) {
          for (let j = 0; j < allpro[i].images.length; j++) {
            const x: any = allpro[i].images[j];
            alldata.push({
              product_id: x.product_id,
              id: x.id,
              src: x.src,
              created_at: x.created_at,
              done: ourMap.get(x.id.toString()) === undefined ? "no" : "yes",
            });
          }
        }
        setData(alldata);
      })
      .catch(() => {
        setError(true);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    doFetching();
  }, [url]);

  return { data, error, loading, doFetching };
};

export default useProducts;
