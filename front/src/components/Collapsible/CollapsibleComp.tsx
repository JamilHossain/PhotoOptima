import { Collapsible } from "@shopify/polaris";

function CollapsibleComp({
  id,
  own_state,
}: {
  id: string;
  own_state: boolean;
}) {
  return (
    <div>
      <Collapsible
        id={id}
        open={own_state}
        transition={{ duration: "500ms", timingFunction: "ease-in-out" }}
        expandOnPrint
      >
        <p>
          Your
          <br /> mailing
          <br /> list
          <br /> lets
          <br /> you <br />
          contact
          <br /> customers
          <br /> or visitors
          <br /> who have shown
          <br /> an interest
          <br /> in your store.
          <br /> Reach out to them
          <br /> with exclusive offers
          <br /> or updates about
          <br /> your products.
        </p>
      </Collapsible>
    </div>
  );
}

export default CollapsibleComp;
