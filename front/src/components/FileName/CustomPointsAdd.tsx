import { useCallback, useState } from "react";
import { Icon, Tooltip } from "@shopify/polaris";
import { AddMajor } from "@shopify/polaris-icons";

function CustomPointsAdd({ title }: { title: string }) {
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
        <p
          style={{
            display: "inline-block",
            fontWeight: "bold",
            color: hover ? "blue" : "black",
          }}
        >
          {title}
        </p>
        <span
          style={{
            display: "inline-block",
            width: "fit-content",
            height: "fit-content",
          }}
        >
          <Icon source={AddMajor} tone={hover ? "emphasis" : undefined} />
        </span>
      </div>
    </Tooltip>
  );
}
export default CustomPointsAdd;
