import { createRoot } from "react-dom/client";
import { Slider } from ".";

describe("Slider", () => {
  it("renders without crashing", () => {
    const div = document.createElement("div");
    const root = createRoot(div);
    root.render(
      <Slider
        label="Test"
        max={100}
        min={0}
        onChange={() => {
          noOp();
        }}
        step={1}
        value={0}
      />
    );
    root.unmount();
  });
});

function noOp(): void {
  // eslint-disable-next-line no-useless-return
  return;
}
