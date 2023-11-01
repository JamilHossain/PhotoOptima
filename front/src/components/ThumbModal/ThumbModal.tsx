import { Divider, Modal, Spinner } from "@shopify/polaris";
import useThumbStore from "../../hooks/useThumbStore";

function ThumbModal() {
  const isThumbModalActive = useThumbStore((state) => state.isThumbModalActive);
  const imageUrl1 = useThumbStore((state) => state.imageUrl1);
  const image1Loaded = useThumbStore((state) => state.image1Loaded);
  const resetIsThumbModalActive = useThumbStore(
    (state) => state.resetIsThumbModalActive
  );
  const setImage1Loaded = useThumbStore((state) => state.setImage1Loaded);

  return (
    <div>
      <Modal
        open={isThumbModalActive}
        onClose={resetIsThumbModalActive}
        title="Preview"
        size="large"
      >
        <Modal.Section>
          <h1>View Image</h1>
          <Divider />
          {!image1Loaded && (
            <Spinner accessibilityLabel="Spinner example" size="large" />
          )}
          <img
            src={imageUrl1}
            alt="Image 1"
            onLoad={() => {
              setImage1Loaded(true);
            }}
          />
        </Modal.Section>
      </Modal>
    </div>
  );
}

export default ThumbModal;
