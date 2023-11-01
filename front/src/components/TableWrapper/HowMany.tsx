/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Popover, ActionList, Icon } from "@shopify/polaris";
import { TickSmallMinor } from "@shopify/polaris-icons";
import { useState, useCallback } from "react";

function HowMany({
  howMany,
  setHowMany,
  setPage,
}: {
  howMany: number;
  setHowMany: React.Dispatch<React.SetStateAction<number>>;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}) {
  const [isActive, setIsActive] = useState<boolean>(false);
  const toggleIsActive = useCallback(
    () => setIsActive((isActive) => !isActive),
    []
  );

  const handleAction1 = useCallback(() => {
    setPage(1);
    setHowMany(5);
    toggleIsActive();
  }, []);
  const handleAction2 = useCallback(() => {
    setPage(1);
    setHowMany(10);
    toggleIsActive();
  }, []);
  const handleAction3 = useCallback(() => {
    setPage(1);
    setHowMany(25);
    toggleIsActive();
  }, []);
  const handleAction4 = useCallback(() => {
    setPage(1);
    setHowMany(50);
    toggleIsActive();
  }, []);
  const handleAction5 = useCallback(() => {
    setPage(1);
    setHowMany(100);
    toggleIsActive();
  }, []);

  const activator = (
    <Button onClick={toggleIsActive} disclosure="down">
      {howMany.toString() + " items / page"}
    </Button>
  );

  return (
    <div style={{ height: "25px" }}>
      <Popover
        active={isActive}
        activator={activator}
        autofocusTarget="first-node"
        onClose={toggleIsActive}
      >
        <ActionList
          actionRole="menuitem"
          items={[
            {
              content: "5",
              onAction: handleAction1,
              suffix:
                howMany === 5 ? <Icon source={TickSmallMinor} /> : undefined,
            },
            {
              content: "10",
              onAction: handleAction2,
              suffix:
                howMany === 10 ? <Icon source={TickSmallMinor} /> : undefined,
            },
            {
              content: "25",
              onAction: handleAction3,
              suffix:
                howMany === 25 ? <Icon source={TickSmallMinor} /> : undefined,
            },
            {
              content: "50",
              onAction: handleAction4,
              suffix:
                howMany === 50 ? <Icon source={TickSmallMinor} /> : undefined,
            },
            {
              content: "100",
              onAction: handleAction5,
              suffix:
                howMany === 100 ? <Icon source={TickSmallMinor} /> : undefined,
            },
          ]}
        />
      </Popover>
    </div>
  );
}

export default HowMany;
