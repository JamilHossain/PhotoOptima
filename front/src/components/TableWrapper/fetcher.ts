/* eslint-disable @typescript-eslint/no-explicit-any */
import { HOST } from "../host.json";

export const allproducts = async (): Promise<any> => {
  const res = await fetch(`${HOST}/allproducts`);
  const response = await res.json();
  const serverFlags = response.serverFlags;
  const ourMap = new Map<string, number>();
  for (let i = 0; i < serverFlags.length; i++) {
    ourMap.set(serverFlags[i].img_id, i);
  }
  const allpro: any = response.products;
  const alldata: {
    product_id: any;
    id: any;
    src: any;
    created_at: any;
    done: any;
    size: any;
    size_saved: any;
    alt_tags: any[];
    crushed_at: any;
    file_name: any;
  }[] = [];
  for (let i = 0; i < allpro.length; i++) {
    for (let j = 0; j < allpro[i].images.length; j++) {
      const x: any = allpro[i].images[j];
      const from_server: any = ourMap.get(x.id.toString());
      const crushed: boolean = !(from_server === undefined);
      alldata.push({
        product_id: x.product_id,
        id: x.id,
        src: x.src,
        created_at: x.created_at,
        done: crushed ? "yes" : "no",
        size: crushed ? from_server.size : "no",
        size_saved: crushed ? from_server.size_saved : "no",
        alt_tags: crushed ? from_server.alt_tags : [],
        crushed_at: crushed ? from_server.crushed_at : "no",
        file_name: x.src.split("?")[0].split("/").pop(),
      });
      //////////////
      console.log(x.src.split("?")[0].split("/").pop());
    }
  }
  return alldata;
};
