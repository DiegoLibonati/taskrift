import type { Task } from "@/types/app";

import { getTasksFromLocalStorage } from "@/helpers/getTasksFromLocalStorage";

import { mockTasks } from "@tests/__mocks__/tasks.mock";

describe("getTasksFromLocalStorage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("when localStorage has no tasks", () => {
    it("should return an empty array", () => {
      expect(getTasksFromLocalStorage()).toEqual([]);
    });
  });

  describe("when localStorage has tasks", () => {
    it("should return the parsed tasks array", () => {
      localStorage.setItem("tasks", JSON.stringify(mockTasks));
      expect(getTasksFromLocalStorage()).toEqual(mockTasks);
    });

    it("should return a single task correctly", () => {
      const tasks: Task[] = [
        { id: "1", category: "tasks", text: "Test task", complete: false },
      ];
      localStorage.setItem("tasks", JSON.stringify(tasks));
      const result = getTasksFromLocalStorage();
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        id: "1",
        category: "tasks",
        text: "Test task",
        complete: false,
      });
    });

    it("should return completed tasks correctly", () => {
      const tasks: Task[] = [
        { id: "2", category: "finish", text: "Done", complete: true },
      ];
      localStorage.setItem("tasks", JSON.stringify(tasks));
      const result = getTasksFromLocalStorage();
      expect(result[0]!.complete).toBe(true);
    });

    it("should return all tasks from different categories", () => {
      localStorage.setItem("tasks", JSON.stringify(mockTasks));
      const result = getTasksFromLocalStorage();
      expect(result).toHaveLength(2);
      expect(result[0]!.category).toBe("tasks");
      expect(result[1]!.category).toBe("progress");
    });
  });
});
