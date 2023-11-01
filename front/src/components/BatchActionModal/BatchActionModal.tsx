import { Button, Modal } from "@shopify/polaris";
import useBatchActionStore from "../../hooks/useBatchActionStore";

function BatchActionModal() {
  const isModalActive = useBatchActionStore((state) => state.isModalActive);
  const whichModal = useBatchActionStore((state) => state.whichModal);
  const setIsModalActive = useBatchActionStore(
    (state) => state.setIsModalActive
  );
  return (
    <div>
      <Modal
        open={isModalActive}
        onClose={() => setIsModalActive(false)}
        title={
          whichModal === "compress-all"
            ? "Start compress operation"
            : "Start restore operation"
        }
        size="large"
      >
        <Modal.Section>
          {whichModal === "compress-all" && (
            <div>
              <div style={{ paddingBottom: "7px" }}>
                <h3>Are you sure ?</h3>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Button onClick={() => setIsModalActive(false)}>Cancel</Button>
                <div style={{ minWidth: "10px" }}></div>
                <Button>Compress</Button>
              </div>
            </div>
          )}
          {whichModal === "restore-all" && (
            <div>
              <div style={{ paddingBottom: "7px" }}>
                <p>
                  We'll restore 'n' images in your store now.
                  <br />
                  We will also stop automatic compression.
                  <br />
                  Would you like to proceed?
                </p>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Button onClick={() => setIsModalActive(false)}>Cancel</Button>
                <div style={{ minWidth: "10px" }}></div>
                <Button>Restore</Button>
              </div>
            </div>
          )}
        </Modal.Section>
      </Modal>
    </div>
  );
}

export default BatchActionModal;
