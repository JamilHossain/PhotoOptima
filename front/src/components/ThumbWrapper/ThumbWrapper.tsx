import { ReactNode } from "react";
import useThumbStore from "../../hooks/useThumbStore";

function ThumbWrapper({
  img_src,
  children,
}: {
  img_src: string;
  children: ReactNode;
}) {
  const setIsThumbModalActive = useThumbStore(
    (state) => state.setIsThumbModalActive
  );
  const setImageUrl1 = useThumbStore((state) => state.setImageUrl1);
  const setImage1Loaded = useThumbStore((state) => state.setImage1Loaded);
  return (
    <div
      style={{ width: "fit-content", height: "fit-content" }}
      onClick={() => {
        setImage1Loaded(false);
        setImageUrl1(`${img_src}&width=500&height=500&crop=center`);
        setIsThumbModalActive();
      }}
    >
      {children}
    </div>
  );
}

export default ThumbWrapper;
