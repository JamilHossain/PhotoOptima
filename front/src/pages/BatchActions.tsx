import { Button, Grid, LegacyCard, Page } from "@shopify/polaris";
import useBatchActionStore from "../hooks/useBatchActionStore";

function BatchActions() {
  const setIsModalActive = useBatchActionStore(
    (state) => state.setIsModalActive
  );
  const setWhichModal = useBatchActionStore((state) => state.setWhichModal);
  return (
    <div>
      <Page fullWidth>
        <Grid>
          <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 3, lg: 6, xl: 6 }}>
            <LegacyCard title="Batch Compress" sectioned>
              <div
                style={{
                  display: "flex",
                  flex: 1,
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <p style={{ display: "inline-block" }}>
                  You have 'n' images to compress
                </p>
                <div
                  style={{ display: "inline-block", minHeight: "20px" }}
                ></div>
                <Button
                  onClick={() => {
                    setWhichModal("compress-all");
                    setIsModalActive(true);
                  }}
                >
                  Compress 'n' Images
                </Button>
              </div>
            </LegacyCard>
          </Grid.Cell>
          <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 3, lg: 6, xl: 6 }}>
            <LegacyCard title="Batch Restore" sectioned>
              <div
                style={{
                  display: "flex",
                  flex: 1,
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <p style={{ display: "inline-block" }}>
                  You have 'n' images to restore
                </p>
                <div
                  style={{ display: "inline-block", minHeight: "20px" }}
                ></div>
                <Button
                  onClick={() => {
                    setWhichModal("restore-all");
                    setIsModalActive(true);
                  }}
                >
                  Restore 'n' Images
                </Button>
              </div>
            </LegacyCard>
          </Grid.Cell>
        </Grid>
      </Page>
    </div>
  );
}

export default BatchActions;
