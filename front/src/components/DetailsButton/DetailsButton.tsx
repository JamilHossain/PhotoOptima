import { Button } from "@shopify/polaris";

function DetailsButton({
  own_state,
  area_controls_id,
  toggleState,
}: {
  own_state: boolean;
  area_controls_id: string;
  toggleState: () => void;
}) {
  return (
    <div>
      <Button
        onClick={toggleState}
        ariaExpanded={own_state}
        ariaControls={area_controls_id}
        tone={own_state ? "critical" : undefined}
        disclosure={own_state ? "up" : "down"}
      >
        {own_state ? "Close" : "Details"}
      </Button>
    </div>
  );
}

export default DetailsButton;
