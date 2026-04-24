import { setLocalStorage } from "@/helpers/setLocalStorage";

describe("setLocalStorage", () => {
  afterEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe("when storing values", () => {
    it("should store a string as JSON", () => {
      setLocalStorage("key", "value");
      expect(localStorage.getItem("key")).toBe(JSON.stringify("value"));
    });

    it("should store an array as JSON", () => {
      const data = [1, 2, 3];
      setLocalStorage("key", data);
      expect(localStorage.getItem("key")).toBe(JSON.stringify(data));
    });

    it("should store an object as JSON", () => {
      const data = { id: "1", text: "test" };
      setLocalStorage("key", data);
      expect(localStorage.getItem("key")).toBe(JSON.stringify(data));
    });

    it("should store null as JSON", () => {
      setLocalStorage("key", null);
      expect(localStorage.getItem("key")).toBe(JSON.stringify(null));
    });

    it("should overwrite an existing value", () => {
      setLocalStorage("key", "first");
      setLocalStorage("key", "second");
      expect(localStorage.getItem("key")).toBe(JSON.stringify("second"));
    });
  });
});
