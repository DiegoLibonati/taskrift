import { screen } from "@testing-library/dom";

import type { Page } from "@/types/pages";

import TaskriftPage from "@/pages/TaskriftPage/TaskriftPage";

import { mockTasks } from "@tests/__mocks__/tasks.mock";

const renderPage = (): Page => {
  const element = TaskriftPage();
  document.body.appendChild(element);
  return element;
};

describe("TaskriftPage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  describe("rendering", () => {
    it("should create a main element", () => {
      renderPage();
      expect(document.querySelector<HTMLElement>("main")).toBeInTheDocument();
    });

    it("should have the taskrift-page class", () => {
      const element = renderPage();
      expect(element).toHaveClass("taskrift-page");
    });

    it("should render the tasks menu", () => {
      renderPage();
      expect(
        document.querySelector<HTMLDivElement>("#tasks")
      ).toBeInTheDocument();
    });

    it("should render the progress menu", () => {
      renderPage();
      expect(
        document.querySelector<HTMLDivElement>("#progress")
      ).toBeInTheDocument();
    });

    it("should render the finish menu", () => {
      renderPage();
      expect(
        document.querySelector<HTMLDivElement>("#finish")
      ).toBeInTheDocument();
    });

    it("should render the open settings button for each menu", () => {
      renderPage();
      expect(
        screen.getByRole("button", { name: "Open tasks settings" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Open progress settings" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Open finish settings" })
      ).toBeInTheDocument();
    });

    it("should render an empty page when localStorage has no tasks", () => {
      renderPage();
      const allTaskItems = document.querySelectorAll<HTMLLIElement>(
        ".menu__note-list-item"
      );
      expect(allTaskItems).toHaveLength(0);
    });

    it("should render tasks from localStorage in their respective menus", () => {
      localStorage.setItem("tasks", JSON.stringify(mockTasks));
      renderPage();
      expect(screen.getByText("Task 1")).toBeInTheDocument();
      expect(screen.getByText("Task 2")).toBeInTheDocument();
    });

    it("should render a task in the correct menu based on its category", () => {
      localStorage.setItem("tasks", JSON.stringify(mockTasks));
      renderPage();
      const tasksMenuList = document.querySelector<HTMLUListElement>(
        ".menu__note-list-tasks"
      );
      const progressMenuList = document.querySelector<HTMLUListElement>(
        ".menu__note-list-progress"
      );
      expect(tasksMenuList?.children).toHaveLength(1);
      expect(progressMenuList?.children).toHaveLength(1);
    });

    it("should render a completed task with the complete class", () => {
      const completedTask = [
        { id: "1", category: "tasks", text: "Done task", complete: true },
      ];
      localStorage.setItem("tasks", JSON.stringify(completedTask));
      renderPage();
      const taskItem = document.querySelector<HTMLLIElement>(
        ".menu__note-list-item"
      );
      expect(taskItem).toHaveClass("menu__note-list-item--line");
    });

    it("should render an incomplete task without the complete class", () => {
      const incompleteTask = [
        { id: "1", category: "tasks", text: "Pending task", complete: false },
      ];
      localStorage.setItem("tasks", JSON.stringify(incompleteTask));
      renderPage();
      const taskItem = document.querySelector<HTMLLIElement>(
        ".menu__note-list-item"
      );
      expect(taskItem).not.toHaveClass("menu__note-list-item--line");
    });
  });

  describe("cleanup", () => {
    it("should not throw when cleanup is called", () => {
      const element = renderPage();
      expect(() => element.cleanup?.()).not.toThrow();
    });

    it("should not throw when cleanup is called with tasks loaded from localStorage", () => {
      localStorage.setItem("tasks", JSON.stringify(mockTasks));
      const element = renderPage();
      expect(() => element.cleanup?.()).not.toThrow();
    });
  });
});
