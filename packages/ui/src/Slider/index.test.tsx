import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Slider } from ".";

describe("Slider", () => {
  it("renders without crashing", () => {
    render(
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
  });

  it("renders with a value", () => {
    render(
      <Slider
        label="Test"
        max={100}
        min={0}
        onChange={() => {
          noOp();
        }}
        step={1}
        value={50}
      />
    );

    expect(screen.getByDisplayValue("50")).toBeInTheDocument();
  });

  it("renders with a label", () => {
    render(
      <Slider
        label="Test"
        max={100}
        min={0}
        onChange={() => {
          noOp();
        }}
        step={1}
        value={50}
      />
    );

    expect(screen.getByText("Test")).toBeInTheDocument();
  });
});

function noOp(): void {
  // eslint-disable-next-line no-useless-return
  return;
}
