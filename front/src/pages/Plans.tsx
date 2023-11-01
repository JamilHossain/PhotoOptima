import { Grid, Page, LegacyCard, Text, Button } from "@shopify/polaris";

function Plans() {
  return (
    <div>
      <Page fullWidth>
        <Grid>
          <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 2, lg: 4, xl: 4 }}>
            <LegacyCard sectioned>
              <Text variant="heading3xl" as="h1" alignment="center">
                Micro
              </Text>
              <div style={{ minHeight: "30px" }}></div>
              <Text
                variant="heading3xl"
                as="h1"
                fontWeight="bold"
                alignment="center"
              >
                500 MB
              </Text>
              <Text as="p" alignment="center">
                OF IMAGES PER MONTH
              </Text>
              <div style={{ minHeight: "30px" }}></div>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Button tone="success">Subscribe</Button>
              </div>
              <div style={{ minHeight: "30px" }}></div>

              <Text
                variant="headingXl"
                as="h4"
                alignment="center"
                fontWeight="bold"
              >
                $ 5.00
              </Text>
              <Text as="p" alignment="center">
                per month
              </Text>
            </LegacyCard>
          </Grid.Cell>
          <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 2, lg: 4, xl: 4 }}>
            <LegacyCard sectioned>
              <Text variant="heading3xl" as="h1" alignment="center">
                Pro
              </Text>
              <div style={{ minHeight: "30px" }}></div>
              <Text
                variant="heading3xl"
                as="h1"
                fontWeight="bold"
                alignment="center"
              >
                2 GB
              </Text>
              <Text as="p" alignment="center">
                OF IMAGES PER MONTH
              </Text>
              <div style={{ minHeight: "30px" }}></div>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Button tone="success">Subscribe</Button>
              </div>
              <div style={{ minHeight: "30px" }}></div>

              <Text
                variant="headingXl"
                as="h4"
                alignment="center"
                fontWeight="bold"
              >
                $ 10.00
              </Text>
              <Text as="p" alignment="center">
                per month
              </Text>
            </LegacyCard>
          </Grid.Cell>
          <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 2, lg: 4, xl: 4 }}>
            <LegacyCard sectioned>
              <Text variant="heading3xl" as="h1" alignment="center">
                Advanced
              </Text>
              <div style={{ minHeight: "30px" }}></div>
              <Text
                variant="heading3xl"
                as="h1"
                fontWeight="bold"
                alignment="center"
              >
                5 GB
              </Text>
              <Text as="p" alignment="center">
                OF IMAGES PER MONTH
              </Text>
              <div style={{ minHeight: "30px" }}></div>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Button tone="success">Subscribe</Button>
              </div>
              <div style={{ minHeight: "30px" }}></div>

              <Text
                variant="headingXl"
                as="h4"
                alignment="center"
                fontWeight="bold"
              >
                $ 20.00
              </Text>
              <Text as="p" alignment="center">
                per month
              </Text>
            </LegacyCard>
          </Grid.Cell>
        </Grid>
      </Page>
    </div>
  );
}

export default Plans;
