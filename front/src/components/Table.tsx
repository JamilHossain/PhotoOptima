/* eslint-disable @typescript-eslint/no-explicit-any */
import { IndexTable, LegacyCard, Thumbnail, Button } from "@shopify/polaris";
import { HOST } from "./host.json";
import { ReactNode, useState } from "react";
import ThumbWrapper from "./ThumbWrapper/ThumbWrapper";
import CollapsibleComp from "./Collapsible/CollapsibleComp";
import DetailsButton from "./DetailsButton/DetailsButton";

function Table({ data, ourRef }: { data: any[]; ourRef: { current: number } }) {
  const [collapsedArray, setCollapsedArray] = useState<boolean[]>(
    new Array(data.length).fill(false)
  );

  const resourceName = {
    singular: "pricture",
    plural: "prictures",
  };

  const processed_data: {
    filename: string;
    thumb: ReactNode;
    created_at: any;
    click: ReactNode;
  }[] = data.map((item: any) => {
    return {
      thumb: (
        <ThumbWrapper img_src={item.src}>
          <Thumbnail
            source={`${item.src}&width=40&height=40&crop=center`}
            size="small"
            alt={item.src}
          />
        </ThumbWrapper>
      ),
      filename: item.file_name,
      created_at: item.created_at,
      click: (
        <Button
          onClick={() => {
            fetch(`${HOST}/docomp`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                product_id: item.product_id,
                img_id: item.id,
                cdn_url: item.src,
                quality: ourRef.current,
              }),
            })
              .then((response: any) => response.json())
              .then((data: any) => {
                //doFetching();
                alert(JSON.stringify(data));
              })
              .catch((err: any) => {
                alert(JSON.stringify(err));
              });
          }}
          disabled={item.done == "yes"}
        >
          {item.done == "no" ? "Crush" : "Already Crushed"}
        </Button>
      ),
    };
  });

  const rowMarkup = processed_data.map(
    ({ filename, thumb, created_at, click }, index) => (
      <>
        <IndexTable.Row id={created_at} key={index << 1} position={index << 1}>
          <IndexTable.Cell>{thumb}</IndexTable.Cell>
          <IndexTable.Cell>{filename}</IndexTable.Cell>
          <IndexTable.Cell>{created_at}</IndexTable.Cell>
          <IndexTable.Cell>{click}</IndexTable.Cell>
          <IndexTable.Cell>
            {
              <DetailsButton
                own_state={collapsedArray[index]}
                area_controls_id={"collapsComp" + index.toString()}
                toggleState={((index: number) => {
                  return () => {
                    setCollapsedArray([
                      ...collapsedArray.slice(0, index),
                      !collapsedArray[index],
                      ...collapsedArray.slice(index + 1),
                    ]);
                  };
                })(index)}
              />
            }
          </IndexTable.Cell>
        </IndexTable.Row>
        <IndexTable.Row
          id={created_at + "collapsedRow"}
          key={(index << 1) + 1}
          position={(index << 1) + 1}
          rowType="subheader"
          disabled={true}
          selected={false}
        >
          <IndexTable.Cell colSpan={5} flush={true}>
            <CollapsibleComp
              id={"collapsComp" + index.toString()}
              own_state={collapsedArray[index]}
            />
          </IndexTable.Cell>
        </IndexTable.Row>
      </>
    )
  );

  return (
    <LegacyCard>
      <IndexTable
        resourceName={resourceName}
        itemCount={processed_data.length}
        headings={[
          { title: "Thumb" },
          { title: "File name" },
          { title: "Creation Date" },
          { title: "Compress" },
          { title: "Details" },
        ]}
        selectable={false}
      >
        {rowMarkup}
      </IndexTable>
    </LegacyCard>
  );
}

export default Table;
