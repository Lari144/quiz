import { describe, it, expect, vi } from "vitest";
import {
  addRecord,
  deleteQuestion,
  deleteAnswer,
  fetchRecordsCards,
  fetchRecords,
} from "../components/dbServices";

const mockInsert = vi.fn().mockResolvedValue({ data: { id: 1 }, error: null });
const mockFrom = vi.fn().mockReturnThis();

const mockDelete = vi.fn().mockReturnThis();
const mockEq = vi.fn().mockResolvedValue({ data: null, error: null });

const mockSelect = vi.fn().mockReturnThis();
const mockEqSelect = vi
  .fn()
  .mockResolvedValue({ data: { id: 1, user: "abc123" }, error: null });

const mockSupabaseClient = {
  from: mockFrom.mockReturnValue({
    insert: mockInsert,
    select: mockSelect.mockReturnValue({
      eq: mockEqSelect,
    }),
    delete: mockDelete.mockReturnValue({
      eq: mockEq,
    }),
  }),
};

//Add
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

//Delete
describe("deleteQuestion", () => {
  it("should delete a question based on the card_id", async () => {
    const tableName = "test";
    const data = 2;
    const result = await deleteQuestion(mockSupabaseClient, tableName, data);

    expect(mockFrom).toHaveBeenCalledWith(tableName);
    expect(mockDelete).toHaveBeenCalled();
    expect(mockEq).toHaveBeenCalledWith("card_id", data);
    expect(result).toEqual(null);
  });
});

describe("deleteAnswer", () => {
  it("should delete an answer based on the question_id", async () => {
    const tableName = "test";
    const data = 2;
    const result = await deleteAnswer(mockSupabaseClient, tableName, data);

    expect(mockFrom).toHaveBeenCalledWith(tableName);
    expect(mockDelete).toHaveBeenCalled();
    expect(mockEq).toHaveBeenCalledWith("question_id", data);
    expect(result).toEqual(null);
  });
});

//Select
describe("selectCards", () => {
  it("should fetch cards based on the user ID", async () => {
    const tableName = "test";
    const data = "abc123";
    const result = await fetchRecordsCards(mockSupabaseClient, tableName, data);

    expect(mockFrom).toHaveBeenCalledWith(tableName);
    expect(mockSelect).toHaveBeenCalled();
    expect(mockEqSelect).toHaveBeenCalledWith("user", data);
    expect(result).toEqual({ id: 1, user: "abc123" });
  });
});

/*describe("selectRecords", () => {
  it("should fetch a record and return data", async () => {
    const tableName = "test";
    const result = await fetchRecords(mockSupabaseClient, tableName);

    expect(mockFrom).toHaveBeenCalledWith(tableName);
    expect(mockSelect).toHaveBeenCalled();
    expect(mockEqSelect).toHaveBeenCalled();
    expect(result).toEqual({ id: 1 });
  });
});

//Update<*/
