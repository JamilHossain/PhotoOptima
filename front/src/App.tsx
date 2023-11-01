import { Frame } from "@shopify/polaris";
import { Dispatch, useState } from "react";

import Navbar from "./components/Navbar/Navbar";
import Dashboard from "./pages/Dashboard";
import SettingPage from "./pages/SettingPage";
import BatchActions from "./pages/BatchActions";
import Plans from "./pages/Plans";
import About from "./pages/About";
import Help from "./pages/Help";
import ThumbModal from "./components/ThumbModal/ThumbModal";
import BatchActionModal from "./components/BatchActionModal/BatchActionModal";

function App() {
  const [selectedArray, setSelectedArray] = useState<boolean[]>([
    true,
    false,
    false,
    false,
    false,
    false,
  ]);
  return (
    <div>
      <Frame
        navigation={Navbar({ selectedArray, setSelectedArray, giveOnClick })}
      >
        {selectedArray[0] && <Dashboard />}
        {selectedArray[1] && <SettingPage />}
        {selectedArray[2] && <BatchActions />}
        {selectedArray[3] && <Plans />}
        {selectedArray[4] && <About />}
        {selectedArray[5] && <Help />}
        {<ThumbModal />}
        {<BatchActionModal />}
      </Frame>
    </div>
  );
}

const giveOnClick = (
  index: number,
  setFunction: Dispatch<React.SetStateAction<boolean[]>>
) => {
  return (): void => {
    const arr: boolean[] = [false, false, false, false, false, false];
    arr[index] = true;
    setFunction([...arr]);
  };
};

export default App;
