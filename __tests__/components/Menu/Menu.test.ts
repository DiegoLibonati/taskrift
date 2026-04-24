import { screen, fireEvent } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";

import type { MenuProps } from "@/types/props";
import type { MenuComponent } from "@/types/components";

import Menu from "@/components/Menu/Menu";

const defaultProps: MenuProps = {
  id: "tasks",
  title: "TASKS TO DO",
};

const renderComponent = (props: Partial<MenuProps> = {}): MenuComponent => {
  const element = Menu({ ...defaultProps, ...props });
  document.body.appendChild(element);
  return element;
};

describe("Menu", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  describe("rendering", () => {
    it("should create a div with the correct id", () => {
      const element = renderComponent();
      expect(element.id).toBe("tasks");
    });

    it("should have the menu class", () => {
      const element = renderComponent();
      expect(element).toHaveClass("menu");
    });

    it("should render the title", () => {
      renderComponent();
      expect(screen.getByText("TASKS TO DO")).toBeInTheDocument();
    });

    it("should render the open settings button with correct aria-label", () => {
      renderComponent();
      expect(
        screen.getByRole("button", { name: "Open tasks settings" })
      ).toBeInTheDocument();
    });

    it("should render the close settings button with correct aria-label", () => {
      renderComponent();
      expect(
        screen.getByRole("button", { name: "Close tasks settings" })
      ).toBeInTheDocument();
    });

    it("should render the clear all tasks button with correct aria-label", () => {
      renderComponent();
      expect(
        screen.getByRole("button", { name: "Clear all tasks in tasks" })
      ).toBeInTheDocument();
    });

    it("should render the add task button with correct aria-label", () => {
      renderComponent();
      expect(
        screen.getByRole("button", { name: "Add task to tasks" })
      ).toBeInTheDocument();
    });

    it("should render an empty task list", () => {
      renderComponent();
      const list = document.querySelector<HTMLUListElement>(
        ".menu__note-list-tasks"
      );
      expect(list?.children).toHaveLength(0);
    });

    it("should use the provided id for dynamic class names", () => {
      renderComponent({ id: "progress", title: "IN PROGRESS" });
      expect(
        document.querySelector<HTMLUListElement>(".menu__note-list-progress")
      ).toBeInTheDocument();
    });
  });

  describe("behavior", () => {
    describe("config panel", () => {
      it("should open config when open button is clicked", async () => {
        const user = userEvent.setup();
        renderComponent();
        const openBtn = screen.getByRole("button", {
          name: "Open tasks settings",
        });
        await user.click(openBtn);
        expect(
          document.querySelector<HTMLDivElement>(".menu__config-tasks")
        ).toHaveClass("menu__config--open");
      });

      it("should close config when close button is clicked after opening", async () => {
        const user = userEvent.setup();
        renderComponent();
        const openBtn = screen.getByRole("button", {
          name: "Open tasks settings",
        });
        const closeBtn = screen.getByRole("button", {
          name: "Close tasks settings",
        });
        await user.click(openBtn);
        await user.click(closeBtn);
        expect(
          document.querySelector<HTMLDivElement>(".menu__config-tasks")
        ).not.toHaveClass("menu__config--open");
      });
    });

    describe("adding a task", () => {
      it("should add a task to the list when form is submitted with text", async () => {
        const user = userEvent.setup();
        renderComponent();
        const input = document.querySelector<HTMLInputElement>(
          ".menu__form-input-tasks"
        )!;
        await user.type(input, "New task");
        fireEvent.submit(
          document.querySelector<HTMLFormElement>(".menu__form-tasks")!
        );
        expect(
          document.querySelector<HTMLUListElement>(".menu__note-list-tasks")
            ?.children
        ).toHaveLength(1);
      });

      it("should not add a task when the input is empty", () => {
        renderComponent();
        fireEvent.submit(
          document.querySelector<HTMLFormElement>(".menu__form-tasks")!
        );
        expect(
          document.querySelector<HTMLUListElement>(".menu__note-list-tasks")
            ?.children
        ).toHaveLength(0);
      });

      it("should not add a task when the input contains only whitespace", async () => {
        const user = userEvent.setup();
        renderComponent();
        const input = document.querySelector<HTMLInputElement>(
          ".menu__form-input-tasks"
        )!;
        await user.type(input, "   ");
        fireEvent.submit(
          document.querySelector<HTMLFormElement>(".menu__form-tasks")!
        );
        expect(
          document.querySelector<HTMLUListElement>(".menu__note-list-tasks")
            ?.children
        ).toHaveLength(0);
      });

      it("should save the task to localStorage", async () => {
        const user = userEvent.setup();
        renderComponent();
        const input = document.querySelector<HTMLInputElement>(
          ".menu__form-input-tasks"
        )!;
        await user.type(input, "New task");
        fireEvent.submit(
          document.querySelector<HTMLFormElement>(".menu__form-tasks")!
        );
        const stored = JSON.parse(localStorage.getItem("tasks") ?? "[]");
        expect(stored).toHaveLength(1);
        expect(stored[0]).toMatchObject({
          category: "tasks",
          text: "New task",
          complete: false,
        });
      });

      it("should clear the input after adding a task", async () => {
        const user = userEvent.setup();
        renderComponent();
        const input = document.querySelector<HTMLInputElement>(
          ".menu__form-input-tasks"
        )!;
        await user.type(input, "New task");
        fireEvent.submit(
          document.querySelector<HTMLFormElement>(".menu__form-tasks")!
        );
        expect(input.value).toBe("");
      });

      it("should use the mocked uuid as the task id", async () => {
        const user = userEvent.setup();
        renderComponent();
        const input = document.querySelector<HTMLInputElement>(
          ".menu__form-input-tasks"
        )!;
        await user.type(input, "New task");
        fireEvent.submit(
          document.querySelector<HTMLFormElement>(".menu__form-tasks")!
        );
        const stored = JSON.parse(localStorage.getItem("tasks") ?? "[]");
        expect(stored[0].id).toEqual(expect.any(String));
      });
    });

    describe("clear all tasks", () => {
      it("should remove all tasks from the DOM", async () => {
        const user = userEvent.setup();
        renderComponent();
        const input = document.querySelector<HTMLInputElement>(
          ".menu__form-input-tasks"
        )!;
        const form =
          document.querySelector<HTMLFormElement>(".menu__form-tasks")!;
        await user.type(input, "Task 1");
        fireEvent.submit(form);
        await user.type(input, "Task 2");
        fireEvent.submit(form);
        const clearBtn = screen.getByRole("button", {
          name: "Clear all tasks in tasks",
        });
        await user.click(clearBtn);
        expect(
          document.querySelector<HTMLUListElement>(".menu__note-list-tasks")
            ?.children
        ).toHaveLength(0);
      });

      it("should remove only tasks of this menu category from localStorage", async () => {
        const user = userEvent.setup();
        localStorage.setItem(
          "tasks",
          JSON.stringify([
            { id: "1", category: "tasks", text: "Task 1", complete: false },
            { id: "2", category: "progress", text: "Task 2", complete: false },
          ])
        );
        renderComponent();
        const clearBtn = screen.getByRole("button", {
          name: "Clear all tasks in tasks",
        });
        await user.click(clearBtn);
        const stored = JSON.parse(localStorage.getItem("tasks") ?? "[]");
        expect(stored).toHaveLength(1);
        expect(stored[0].category).toBe("progress");
      });

      it("should result in an empty localStorage tasks array when all tasks belong to this menu", async () => {
        const user = userEvent.setup();
        localStorage.setItem(
          "tasks",
          JSON.stringify([
            { id: "1", category: "tasks", text: "Task 1", complete: false },
          ])
        );
        renderComponent();
        const clearBtn = screen.getByRole("button", {
          name: "Clear all tasks in tasks",
        });
        await user.click(clearBtn);
        const stored = JSON.parse(localStorage.getItem("tasks") ?? "[]");
        expect(stored).toEqual([]);
      });
    });

    describe("drop", () => {
      it("should append a dragged task element to the task list", () => {
        renderComponent();
        const taskLi = document.createElement("li");
        const taskId = "tasks/some-task-id";
        taskLi.id = taskId;
        document.body.appendChild(taskLi);
        const tasksList = document.querySelector<HTMLUListElement>(
          ".menu__note-list-tasks"
        )!;
        const dataTransfer = new DataTransfer();
        dataTransfer.setData("text", taskId);
        fireEvent.dragOver(tasksList, { dataTransfer });
        fireEvent.drop(tasksList, { dataTransfer });
        expect(tasksList.contains(taskLi)).toBe(true);
      });
    });
  });

  describe("cleanup", () => {
    it("should not throw when cleanup is called", () => {
      const element = renderComponent();
      expect(() => element.cleanup?.()).not.toThrow();
    });

    it("should clean up active tasks when cleanup is called", async () => {
      const user = userEvent.setup();
      const element = renderComponent();
      const input = document.querySelector<HTMLInputElement>(
        ".menu__form-input-tasks"
      )!;
      await user.type(input, "Task 1");
      fireEvent.submit(
        document.querySelector<HTMLFormElement>(".menu__form-tasks")!
      );
      expect(() => element.cleanup?.()).not.toThrow();
    });
  });
});
