import { Navigation } from "@shopify/polaris";
import {
  HomeMajor,
  SettingsMajor,
  MobileHamburgerMajor,
  DynamicSourceMinor,
  QuestionMarkInverseMinor,
  PageMajor,
} from "@shopify/polaris-icons";
import { Dispatch, ReactNode } from "react";

function Navbar({
  selectedArray,
  setSelectedArray,
  giveOnClick,
}: {
  selectedArray: boolean[];
  setSelectedArray: Dispatch<React.SetStateAction<boolean[]>>;
  giveOnClick: (
    index: number,
    setFunction: Dispatch<React.SetStateAction<boolean[]>>
  ) => () => void;
}): ReactNode {
  return (
    <>
      <Navigation location="/">
        <Navigation.Section
          items={[
            {
              label: "Dashboard",
              icon: HomeMajor,
              selected: selectedArray[0],
              onClick: giveOnClick(0, setSelectedArray),
            },
            {
              label: "Settings",
              icon: SettingsMajor,
              selected: selectedArray[1],
              onClick: giveOnClick(1, setSelectedArray),
            },
            {
              label: "Batch Actions",
              icon: DynamicSourceMinor,
              selected: selectedArray[2],
              onClick: giveOnClick(2, setSelectedArray),
            },
            {
              label: "Plans",
              icon: MobileHamburgerMajor,
              selected: selectedArray[3],
              onClick: giveOnClick(3, setSelectedArray),
            },
            {
              label: "About",
              icon: PageMajor,
              selected: selectedArray[4],
              onClick: giveOnClick(4, setSelectedArray),
            },
            {
              label: "Help",
              icon: QuestionMarkInverseMinor,
              selected: selectedArray[5],
              onClick: giveOnClick(5, setSelectedArray),
            },
          ]}
        />
      </Navigation>
    </>
  );
}

export default Navbar;
