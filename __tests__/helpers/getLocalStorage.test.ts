import { getLocalStorage } from "@/helpers/getLocalStorage";

describe("getLocalStorage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("when the key does not exist", () => {
    it("should return null", () => {
      expect(getLocalStorage("missing-key")).toBeNull();
    });
  });

  describe("when the key exists", () => {
    it("should return the parsed string value", () => {
      localStorage.setItem("key", JSON.stringify("hello"));
      expect(getLocalStorage("key")).toBe("hello");
    });

    it("should return the parsed array value", () => {
      const data = [1, 2, 3];
      localStorage.setItem("key", JSON.stringify(data));
      expect(getLocalStorage("key")).toEqual(data);
    });

    it("should return the parsed object value", () => {
      const data = { id: "1", name: "test" };
      localStorage.setItem("key", JSON.stringify(data));
      expect(getLocalStorage("key")).toEqual(data);
    });

    it("should return the parsed boolean false value", () => {
      localStorage.setItem("key", JSON.stringify(false));
      expect(getLocalStorage("key")).toBe(false);
    });

    it("should return the parsed number value", () => {
      localStorage.setItem("key", JSON.stringify(42));
      expect(getLocalStorage("key")).toBe(42);
    });
  });
});
