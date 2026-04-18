import { screen, fireEvent } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";

import type { TaskProps } from "@/types/props";
import type { TaskComponent } from "@/types/components";

import Task from "@/components/Task/Task";

const defaultProps: TaskProps = {
  id: "test-id",
  category: "tasks",
  complete: false,
  text: "Sample task",
};

const renderComponent = (props: Partial<TaskProps> = {}): TaskComponent => {
  const element = Task({ ...defaultProps, ...props });
  document.body.appendChild(element);
  return element;
};

describe("Task", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  describe("rendering", () => {
    it("should create a list item", () => {
      renderComponent();
      expect(screen.getByRole("listitem")).toBeInTheDocument();
    });

    it("should be draggable", () => {
      const element = renderComponent();
      expect(element.draggable).toBe(true);
    });

    it("should set the id as category/id", () => {
      const element = renderComponent();
      expect(element.id).toBe("tasks/test-id");
    });

    it("should render the task text", () => {
      renderComponent();
      expect(screen.getByText("Sample task")).toBeInTheDocument();
    });

    it("should render a delete button with the correct aria-label", () => {
      renderComponent();
      expect(
        screen.getByRole("button", { name: "delete task test-id" })
      ).toBeInTheDocument();
    });

    it("should add the complete class when complete is true", () => {
      const element = renderComponent({ complete: true });
      expect(element).toHaveClass("menu__note-list-item--line");
    });

    it("should not add the complete class when complete is false", () => {
      const element = renderComponent({ complete: false });
      expect(element).not.toHaveClass("menu__note-list-item--line");
    });
  });

  describe("behavior", () => {
    describe("delete button click", () => {
      it("should remove the task from the DOM", async () => {
        const user = userEvent.setup();
        renderComponent();
        const deleteBtn = screen.getByRole("button", {
          name: "delete task test-id",
        });
        await user.click(deleteBtn);
        expect(screen.queryByRole("listitem")).not.toBeInTheDocument();
      });

      it("should remove the task from localStorage", async () => {
        const user = userEvent.setup();
        localStorage.setItem(
          "tasks",
          JSON.stringify([
            {
              id: "test-id",
              category: "tasks",
              text: "Sample task",
              complete: false,
            },
          ])
        );
        renderComponent();
        const deleteBtn = screen.getByRole("button", {
          name: "delete task test-id",
        });
        await user.click(deleteBtn);
        const stored = JSON.parse(localStorage.getItem("tasks") ?? "[]");
        expect(stored).toEqual([]);
      });
    });

    describe("right-click mousedown", () => {
      it("should remove the task from the DOM", () => {
        const element = renderComponent();
        fireEvent.mouseDown(element, { button: 2 });
        expect(document.body.contains(element)).toBe(false);
      });

      it("should remove the task from localStorage", () => {
        localStorage.setItem(
          "tasks",
          JSON.stringify([
            {
              id: "test-id",
              category: "tasks",
              text: "Sample task",
              complete: false,
            },
          ])
        );
        const element = renderComponent();
        fireEvent.mouseDown(element, { button: 2 });
        const stored = JSON.parse(localStorage.getItem("tasks") ?? "[]");
        expect(stored).toEqual([]);
      });
    });

    describe("middle-click mousedown", () => {
      it("should toggle the complete class on", () => {
        localStorage.setItem(
          "tasks",
          JSON.stringify([
            {
              id: "test-id",
              category: "tasks",
              text: "Sample task",
              complete: false,
            },
          ])
        );
        const element = renderComponent({ complete: false });
        fireEvent.mouseDown(element, { button: 1 });
        expect(element).toHaveClass("menu__note-list-item--line");
      });

      it("should toggle the complete class off when already complete", () => {
        localStorage.setItem(
          "tasks",
          JSON.stringify([
            {
              id: "test-id",
              category: "tasks",
              text: "Sample task",
              complete: true,
            },
          ])
        );
        const element = renderComponent({ complete: true });
        fireEvent.mouseDown(element, { button: 1 });
        expect(element).not.toHaveClass("menu__note-list-item--line");
      });

      it("should update localStorage with toggled complete value", () => {
        localStorage.setItem(
          "tasks",
          JSON.stringify([
            {
              id: "test-id",
              category: "tasks",
              text: "Sample task",
              complete: false,
            },
          ])
        );
        const element = renderComponent({ complete: false });
        fireEvent.mouseDown(element, { button: 1 });
        const stored = JSON.parse(localStorage.getItem("tasks") ?? "[]");
        expect(stored[0].complete).toBe(true);
      });
    });

    describe("drag start", () => {
      it("should set dataTransfer data to the task id", () => {
        const element = renderComponent();
        const dataTransfer = new DataTransfer();
        fireEvent.dragStart(element, { dataTransfer });
        expect(dataTransfer.getData("text")).toBe("tasks/test-id");
      });
    });

    describe("drag end", () => {
      it("should update the task category in localStorage when moved to a new menu", () => {
        localStorage.setItem(
          "tasks",
          JSON.stringify([
            {
              id: "test-id",
              category: "tasks",
              text: "Sample task",
              complete: false,
            },
          ])
        );

        const menuDiv = document.createElement("div");
        menuDiv.id = "progress";
        const noteDiv = document.createElement("div");
        const ul = document.createElement("ul");
        const element = renderComponent();

        menuDiv.appendChild(noteDiv);
        noteDiv.appendChild(ul);
        ul.appendChild(element);
        document.body.appendChild(menuDiv);

        fireEvent.dragEnd(element);

        const stored = JSON.parse(localStorage.getItem("tasks") ?? "[]");
        expect(stored[0].category).toBe("progress");
      });

      it("should update the task element id to reflect the new category", () => {
        localStorage.setItem(
          "tasks",
          JSON.stringify([
            {
              id: "test-id",
              category: "tasks",
              text: "Sample task",
              complete: false,
            },
          ])
        );

        const menuDiv = document.createElement("div");
        menuDiv.id = "finish";
        const noteDiv = document.createElement("div");
        const ul = document.createElement("ul");
        const element = renderComponent();

        menuDiv.appendChild(noteDiv);
        noteDiv.appendChild(ul);
        ul.appendChild(element);
        document.body.appendChild(menuDiv);

        fireEvent.dragEnd(element);

        expect(element.id).toBe("finish/test-id");
      });
    });
  });

  describe("cleanup", () => {
    it("should not throw when cleanup is called", () => {
      const element = renderComponent();
      expect(() => element.cleanup?.()).not.toThrow();
    });

    it("should not respond to mousedown events after cleanup", () => {
      const element = renderComponent();
      element.cleanup?.();
      expect(() => fireEvent.mouseDown(element, { button: 2 })).not.toThrow();
    });
  });
});
