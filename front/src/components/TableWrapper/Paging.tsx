import { Button, InlineStack, TextField } from "@shopify/polaris";
import {
  PaginationStartMinor,
  PaginationEndMinor,
  ChevronLeftMinor,
  ChevronRightMinor,
} from "@shopify/polaris-icons";
import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import HowMany from "./HowMany";

function Paging({
  page,
  setPage,
  isFirstPage,
  isLastPage,
  totalDataPoints,
  howMany,
  setHowMany,
}: {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  isFirstPage: boolean;
  isLastPage: boolean;
  totalDataPoints: number;
  howMany: number;
  setHowMany: React.Dispatch<React.SetStateAction<number>>;
}) {
  const [text, setText] = useState<string>(page.toString());
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 600px)" });

  useEffect(() => {
    setText(page.toString());
  }, [page]);

  return (
    <div
      style={{
        display: "flex",
        paddingTop: "10px",
        flexFlow: isTabletOrMobile ? "column wrap" : "row nowrap",
      }}
    >
      <div
        style={{
          flex: "1 0",
          alignSelf: "center",
          paddingLeft: "10px",
        }}
      >
        <Button>
          {((page - 1) * howMany + 1).toString() +
            "-" +
            Math.min(
              (page - 1) * howMany + howMany,
              totalDataPoints
            ).toString() +
            " of " +
            totalDataPoints.toString() +
            " items."}
        </Button>
      </div>
      <div style={{ flex: "5 0", alignSelf: "center" }}>
        <InlineStack wrap={false} align="center" blockAlign="center" gap="100">
          <Button
            onClick={() => setPage(1)}
            disabled={isFirstPage}
            icon={PaginationStartMinor}
          ></Button>
          <Button
            onClick={() => setPage((p) => p - 1)}
            disabled={isFirstPage}
            icon={ChevronLeftMinor}
          ></Button>
          <div style={{ maxWidth: isTabletOrMobile ? "20%" : "10%" }}>
            <TextField
              label={undefined}
              value={text}
              onChange={(newVal: string) => {
                newVal = newVal.replace(/[^0-9]/g, "");
                if (newVal == "") {
                  setText(newVal);
                  return;
                }
                const newV = parseInt(newVal);
                if (isNaN(newV)) {
                  return;
                }
                if (newV < 1) return;
                if (newV > Math.ceil(totalDataPoints / howMany)) return;
                setText(newVal);
                setPage(newV);
              }}
              autoComplete="off"
            />
          </div>
          <Button
            onClick={() => setPage((p) => p + 1)}
            disabled={isLastPage}
            icon={ChevronRightMinor}
          ></Button>
          <Button
            onClick={() => {
              setPage(Math.ceil(totalDataPoints / howMany));
            }}
            disabled={isLastPage}
            icon={PaginationEndMinor}
          ></Button>
        </InlineStack>
      </div>
      <div style={{ flex: "1 0", alignSelf: "center" }}>
        <HowMany
          howMany={howMany}
          setHowMany={setHowMany}
          setPage={setPage}
        ></HowMany>
      </div>
    </div>
  );
}

export default Paging;
