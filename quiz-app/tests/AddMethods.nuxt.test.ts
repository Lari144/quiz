import { describe, it, expect, vi } from "vitest";
import {
  addRecord,
  addRecordAndSelectId,
  addFile,
} from "../components/dbServices";

const mockInsert = vi.fn().mockResolvedValue({ data: { id: 1 }, error: null });
const mockFrom = vi.fn().mockReturnThis();
const mockSelect = vi.fn().mockResolvedValue({ data: { id: 1 }, error: null });

const mockSupabaseClient = {
  from: mockFrom.mockReturnValue({
    insert: mockInsert,
    select: mockSelect,
  }),
};

describe("addRecord", () => {
  it("should add a record and return data", async () => {
    const tableName = "test";
    const data = { name: "something" };
    const result = await addRecord(mockSupabaseClient, tableName, data);

    expect(mockFrom).toHaveBeenCalledWith(tableName);
    expect(mockInsert).toHaveBeenCalledWith([data]);
    expect(result).toEqual({ id: 1 });
  });
});

describe("addRecordAndSelectID", () => {
  it("should add a record and return ID", async () => {
    const tableName = "test_table";
    const newText = "Test text";
    const cardId = 42;

    const resultId = await addRecordAndSelectId(
      mockSupabaseClient,
      tableName,
      newText,
      cardId
    );

    expect(mockSupabaseClient.from).toHaveBeenCalledWith(tableName);
    expect(mockInsert).toHaveBeenCalledWith([
      { text: newText, card_id: cardId },
    ]);
    expect(mockSelect).toHaveBeenCalledWith("id");
    expect(resultId).toEqual(1);
  });
});
