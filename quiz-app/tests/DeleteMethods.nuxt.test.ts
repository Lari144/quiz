import { describe, it, expect, vi } from "vitest";
import {
  deleteQuestion,
  deleteAnswer,
  deleteRecord,
} from "../components/dbServices";

const mockFrom = vi.fn().mockReturnThis();

const mockDelete = vi.fn().mockReturnThis();
const mockEq = vi.fn().mockResolvedValue({ data: null, error: null });

const mockSupabaseClient = {
  from: mockFrom.mockReturnValue({
    delete: mockDelete.mockReturnValue({
      eq: mockEq,
    }),
  }),
};

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

  it("should throw an error if the deletion fails", async () => {
    const tableName = "test";
    const data = 2;
    const errorMessage = "Deletion failed";
    mockEq.mockRejectedValueOnce(new Error(errorMessage));

    await expect(
      deleteQuestion(mockSupabaseClient, tableName, data)
    ).rejects.toThrow(errorMessage);

    expect(mockFrom).toHaveBeenCalledWith(tableName);
    expect(mockDelete).toHaveBeenCalled();
    expect(mockEq).toHaveBeenCalledWith("card_id", data);
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

  it("should throw an error if the deletion fails", async () => {
    const tableName = "test";
    const data = 2;
    const errorMessage = "Deletion failed";
    mockEq.mockRejectedValueOnce(new Error(errorMessage));

    await expect(
      deleteAnswer(mockSupabaseClient, tableName, data)
    ).rejects.toThrow(errorMessage);

    expect(mockFrom).toHaveBeenCalledWith(tableName);
    expect(mockDelete).toHaveBeenCalled();
    expect(mockEq).toHaveBeenCalledWith("question_id", data);
  });
});

describe("deleteRecord", () => {
  it("should delete a record based on the ID", async () => {
    const tableName = "test";
    const data = 2;
    const result = await deleteRecord(mockSupabaseClient, tableName, data);

    expect(mockFrom).toHaveBeenCalledWith(tableName);
    expect(mockDelete).toHaveBeenCalled();
    expect(mockEq).toHaveBeenCalledWith("id", data);
    expect(result).toEqual(null);
  });

  it("should throw an error if the deletion fails", async () => {
    const tableName = "test";
    const data = 2;
    const errorMessage = "Deletion failed";
    mockEq.mockRejectedValueOnce(new Error(errorMessage));

    await expect(
      deleteRecord(mockSupabaseClient, tableName, data)
    ).rejects.toThrow(errorMessage);

    expect(mockFrom).toHaveBeenCalledWith(tableName);
    expect(mockDelete).toHaveBeenCalled();
    expect(mockEq).toHaveBeenCalledWith("id", data);
  });
});
