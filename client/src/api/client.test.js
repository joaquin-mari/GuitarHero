import { describe, it, expect, vi } from "vitest";
import { getRandomNote } from "./client";

describe("getRandomNote", () => {
  it("calls the correct endpoint", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ note: "A" }),
    });

    vi.stubGlobal("fetch", fetchMock);

    await getRandomNote();

    expect(fetchMock).toHaveBeenCalledWith("/api/notes/random");
  });
});
