/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useCallback,
  useRef,
  useState,
  useDeferredValue,
  //useEffect,
  useMemo,
} from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, TextField, Spinner, InlineStack } from "@shopify/polaris";
import Settings from "../Settings";
import Table from "../Table";
import { allproducts } from "./fetcher";
import TableSkeleton from "./TableSkeleton";
import Paging from "./Paging";

// import TestQ from "./TestQ";

function TableWrapper() {
  const [searchV, setSearchV] = useState<string>("");
  const deferredSearchV = useDeferredValue(searchV);
  const [howMany, setHowMany] = useState<number>(5);
  const [page, setPage] = useState<number>(1);
  const [isFirstPage, setIsFirstPage] = useState<boolean>(false);
  const [isLastPage, setIsLastPage] = useState<boolean>(false);

  const { isLoading, error, data } = useQuery({
    queryKey: ["allProducts"],
    queryFn: allproducts,
  });

  const qualityRef = useRef<number>(70);

  const filteredData = useMemo(() => {
    if (deferredSearchV.trim() === "") {
      return data ? data : [];
    }
    const new_arr = data
      ? data.filter((item: any) =>
          item.file_name
            .toLowerCase()
            .includes(deferredSearchV.trim().toLowerCase())
        )
      : [];
    setPage(1);
    return new_arr;
  }, [data, deferredSearchV]);

  const paginatedData = useMemo(() => {
    if (page == 1) setIsFirstPage(true);
    else setIsFirstPage(false);
    if (Math.ceil(filteredData.length / howMany) == page) setIsLastPage(true);
    else setIsLastPage(false);
    return filteredData.slice(
      (page - 1) * howMany,
      (page - 1) * howMany + howMany
    );
  }, [page, howMany, filteredData]);

  const handleSearchV = useCallback((newV: string) => setSearchV(newV), []);

  if (error) {
    console.log("error");
    return <p>{error.message}</p>;
  }

  return (
    <div>
      <Settings ourRef={qualityRef} />
      {/* <TestQ ourRef={qualityRef} /> */}
      <Card>
        <InlineStack wrap={false} align="start" blockAlign="center" gap="100">
          <div style={{ minWidth: "60%" }}>
            <TextField
              label=""
              value={searchV}
              onChange={handleSearchV}
              autoComplete="off"
            />
          </div>
          {searchV !== deferredSearchV && <Spinner size="small"></Spinner>}
        </InlineStack>
      </Card>
      {!isLoading && <Table data={paginatedData} ourRef={qualityRef} />}
      {isLoading && <TableSkeleton />}
      <Paging
        page={page}
        setPage={setPage}
        isFirstPage={isFirstPage}
        isLastPage={isLastPage}
        totalDataPoints={filteredData ? filteredData.length : 0}
        howMany={howMany}
        setHowMany={setHowMany}
      />
    </div>
  );
}

export default TableWrapper;
