import { describe, it, expect } from "vitest";
import { frequencyToNote } from "./usePitchDetection";

describe("frequencyToNote", () => {
  it("converts 440Hz to A", () => {
    expect(frequencyToNote(440)).toBe("A");
  });

  it("converts 261.63Hz to C", () => {
    expect(frequencyToNote(261.63)).toBe("C");
  });
});
