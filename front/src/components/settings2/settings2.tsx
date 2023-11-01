/* eslint-disable react-hooks/exhaustive-deps */
import {
  LegacyCard,
  LegacyStack,
  RadioButton,
  RangeSlider,
  Badge,
} from "@shopify/polaris";
import { useCallback, useEffect, useState } from "react";
import useRangeStore from "../../hooks/useRangeStore2";

function Settings({ ourRef }: { ourRef: { current: number } }) {
  const [mode, setMode] = useState("");

  const rangeValue = useRangeStore((state) => state.rangeValue);
  const setRangeValue = useRangeStore((state) => state.setRangeValue);

  const handleModeChange = useCallback((_: boolean, newValue: string) => {
    if (newValue === "Balanced") {
      ourRef.current = 70;
    }
    if (newValue === "Conservative") {
      ourRef.current = 85;
    }
    setMode(newValue);
    localStorage.setItem("selectedMode", newValue);
  }, []);

  const handleRangeSliderChange = useCallback((new_range_value: number) => {
    setRangeValue(new_range_value);
    ourRef.current = new_range_value;
    localStorage.setItem("rangeValue", new_range_value.toString());
  }, []);

  useEffect(() => {
    const mode: string | null = localStorage.getItem("selectedMode");
    const range: string | null = localStorage.getItem("rangeValue");
    if (mode) {
      setMode(mode);
    }
    if (range) {
      setRangeValue(parseInt(range));
    }
  }, []);

  return (
    <LegacyCard title="Compression Settings :" sectioned>
      <LegacyStack vertical>
        <RadioButton
          label={
            mode === "Balanced" ? (
              <ShowRange type={true} val="Balanced" point={70} />
            ) : (
              <ShowRange type={false} val="Balanced" point={70} />
            )
          }
          helpText=""
          checked={mode === "Balanced"}
          id="Balanced"
          name="settings"
          onChange={handleModeChange}
        />
        <RadioButton
          label={
            mode === "Conservative" ? (
              <ShowRange type={true} val="Conservative" point={85} />
            ) : (
              <ShowRange type={false} val="Conservative" point={85} />
            )
          }
          helpText=""
          id="Conservative"
          name="settings"
          checked={mode === "Conservative"}
          onChange={handleModeChange}
        />
        <RadioButton
          label={
            mode === "Custom" ? (
              <ShowRange type={true} val="Custom" point={rangeValue} />
            ) : (
              <ShowRange type={false} val="Custom" point={rangeValue} />
            )
          }
          helpText=""
          id="Custom"
          name="settings"
          checked={mode === "Custom"}
          onChange={handleModeChange}
        />
      </LegacyStack>
      <div style={{ minHeight: "20px" }}></div>
      <div
        style={{
          maxWidth: "500px",
          marginLeft: "25px",
        }}
      >
        <RangeSlider
          label="Quality :"
          value={rangeValue}
          onChange={handleRangeSliderChange}
          output
          min={50}
          max={100}
          step={1}
          helpText=""
          disabled={mode !== "Custom"}
        />
      </div>
    </LegacyCard>
  );
}

function ShowRange({
  val,
  point,
  type,
}: {
  val: string;
  point: number;
  type: boolean;
}): JSX.Element {
  return type ? (
    <Badge tone="success">{`${val} : ${point} %`}</Badge>
  ) : (
    <Badge>{`${val} : ${point} %`}</Badge>
  );
}

export default Settings;
