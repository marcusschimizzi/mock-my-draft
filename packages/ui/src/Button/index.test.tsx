import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { Button } from ".";

describe("Button", () => {
  it("renders without crashing", () => {
    render(<Button>Test</Button>);
  });

  it("fires the onClick event when button is pressed", async () => {
    const onClick = jest.fn();
    render(<Button onClick={onClick}>Test</Button>);

    await userEvent.click(screen.getByText("Test"));
    expect(onClick).toHaveBeenCalled();
  });
});
