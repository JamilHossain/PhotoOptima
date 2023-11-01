import { useCallback, useState } from "react";
import { Icon, Tooltip } from "@shopify/polaris";
import { DeleteMajor, DragHandleMinor } from "@shopify/polaris-icons";

function CustomPointDnd({ title }: { title: string }) {
  const [hover, setHover] = useState<boolean>(false);

  const onMouseEnter = useCallback(() => setHover(true), []);
  const onMouseLeave = useCallback(() => setHover(false), []);

  return (
    <Tooltip
      activatorWrapper="span"
      hoverDelay={500}
      content="Click to add it in template"
    >
      <div
        style={{
          width: "200px",
          height: "40px",
          padding: "5px",
          margin: "5px",
          border: "2px solid " + (hover ? "blue" : "black"),
          borderRadius: "12px",
          display: "inline-flex",
          flexFlow: "row nowrap",
          justifyContent: "space-between",
          alignContent: "center",
          cursor: "pointer",
          backgroundColor: "white",
        }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div
          style={{
            display: "inline-flex",
            justifyContent: "left",
            alignContent: "center",
          }}
        >
          <div
            style={{
              display: "inline-block",
              height: "fit-content",
              width: "fit-content",
            }}
          >
            <Icon
              source={DragHandleMinor}
              tone={hover ? "emphasis" : undefined}
            />
          </div>
          <p
            style={{
              display: "inline-block",
              fontWeight: "bold",
              color: hover ? "blue" : "black",
            }}
          >
            {title}
          </p>
        </div>
        <span
          style={{
            display: "inline-block",
            width: "fit-content",
            height: "fit-content",
          }}
        >
          <Icon source={DeleteMajor} tone={hover ? "emphasis" : undefined} />
        </span>
      </div>
    </Tooltip>
  );
}

export default CustomPointDnd;
