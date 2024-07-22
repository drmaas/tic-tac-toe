import { describe, it, expect, beforeEach, afterEach } from "vitest";
import "@testing-library/jest-dom";
import { StrictMode } from "react";
import Game from "./components/Game"; // Update with the actual path to your Game component
import ReactDOM from "react-dom/client";
import { act, screen } from "@testing-library/react";

describe("Root rendering", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    container.setAttribute("id", "root");
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it("renders Game component inside StrictMode without crashing", () => {
    act(() => {
      ReactDOM.createRoot(container).render(
        <StrictMode>
          <Game />
        </StrictMode>
      );
    });
    expect(container.querySelector(".game")).toBeInTheDocument();
  });

  it("displays initial Game component state correctly", () => {
    act(() => {
      ReactDOM.createRoot(container).render(
        <StrictMode>
          <Game />
        </StrictMode>
      );
    });
    expect(container.querySelector(".status")).toHaveTextContent(
      "Next player: X"
    );
    expect(container.querySelector(".game-board")).toBeInTheDocument();
    expect(container.querySelector(".game-info")).toBeInTheDocument();
  });
});
