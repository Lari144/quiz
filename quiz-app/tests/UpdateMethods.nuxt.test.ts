import { describe, it, expect, vi } from "vitest";
import {
  updateRecord,
  updateAnswer,
  updateQuestionAndAnswer,
  updateQuestionWithPicture,
  set_incorrect,
} from "../components/dbServices";

const mockEq = vi.fn().mockResolvedValue({
  data: [{ id: 1, title: "New Title" }],
  error: null,
});

const mockUpdate = vi.fn().mockReturnValue({
  eq: mockEq,
});

const mockFrom = vi.fn().mockReturnValue({
  update: mockUpdate,
});

const mockSupabaseClient = {
  from: mockFrom,
};

describe("updateRecord", () => {
  it("should update a record and return the updated data", async () => {
    const tableName = "items";
    const id = 1;
    const newTitle = "Updated Title";

    const result = await updateRecord(
      mockSupabaseClient,
      tableName,
      id,
      newTitle
    );

    expect(mockFrom).toHaveBeenCalledWith(tableName);
    expect(mockUpdate).toHaveBeenCalledWith({ title: newTitle });
    expect(mockEq).toHaveBeenCalledWith("id", id);
    expect(result).toEqual([{ id: 1, title: "New Title" }]);
  });

  it("should throw an error if the update fails", async () => {
    const errorMessage = "Failed to update";
    mockEq.mockRejectedValueOnce(new Error(errorMessage));

    await expect(
      updateRecord(mockSupabaseClient, "items", 1, "Updated Title")
    ).rejects.toThrow(errorMessage);

    expect(mockFrom).toHaveBeenCalledWith("items");
    expect(mockUpdate).toHaveBeenCalledWith({ title: "Updated Title" });
    expect(mockEq).toHaveBeenCalledWith("id", 1);
  });
});

describe("updateAnswer", () => {
  it("updates the is_correct field and returns the updated data", async () => {
    const tableName = "answers";
    const id = 1;
    const updatedData = [{ id: 1, is_correct: true }];
    mockEq.mockResolvedValueOnce({ data: updatedData, error: null });

    const result = await updateAnswer(mockSupabaseClient, tableName, id);

    expect(mockFrom).toHaveBeenCalledWith(tableName);
    expect(mockUpdate).toHaveBeenCalledWith({ is_correct: true });
    expect(mockEq).toHaveBeenCalledWith("id", id);
    expect(result).toEqual(updatedData);
  });

  it("throws an error if the update operation fails", async () => {
    const tableName = "answers";
    const id = 1;
    const errorMessage = "Update failed";
    mockEq.mockRejectedValueOnce(new Error(errorMessage));

    await expect(
      updateAnswer(mockSupabaseClient, tableName, id)
    ).rejects.toThrow(errorMessage);

    expect(mockFrom).toHaveBeenCalledWith(tableName);
    expect(mockUpdate).toHaveBeenCalledWith({ is_correct: true });
    expect(mockEq).toHaveBeenCalledWith("id", id);
  });
});

describe("updateQuestionAndAnswer", () => {
  it("updates the text of a question and returns the updated data", async () => {
    const tableName = "questions";
    const id = 2;
    const newText = "What is the answer?";
    const updatedData = [{ id: 2, text: newText }];
    mockEq.mockResolvedValueOnce({ data: updatedData, error: null });

    const result = await updateQuestionAndAnswer(
      mockSupabaseClient,
      tableName,
      id,
      newText
    );

    expect(mockFrom).toHaveBeenCalledWith(tableName);
    expect(mockUpdate).toHaveBeenCalledWith({ text: newText });
    expect(mockEq).toHaveBeenCalledWith("id", id);
    expect(result).toEqual(updatedData);
  });

  it("throws an error if the update operation fails", async () => {
    const tableName = "questions";
    const id = 2;
    const newText = "What is the answer?";
    const errorMessage = "Update failed";
    mockEq.mockRejectedValueOnce(new Error(errorMessage));

    await expect(
      updateQuestionAndAnswer(mockSupabaseClient, tableName, id, newText)
    ).rejects.toThrow(errorMessage);

    expect(mockFrom).toHaveBeenCalledWith(tableName);
    expect(mockUpdate).toHaveBeenCalledWith({ text: newText });
    expect(mockEq).toHaveBeenCalledWith("id", id);
  });
});

describe("updateQuestionWithPicture", () => {
  it("updates the picture_url of a question and returns the updated data", async () => {
    const tableName = "questions";
    const id = 3;
    const url = "path/to/picture";
    const updatedData = [{ id: 3, picture_url: url }];
    mockEq.mockResolvedValueOnce({ data: updatedData, error: null });

    const result = await updateQuestionWithPicture(
      mockSupabaseClient,
      tableName,
      id,
      url
    );

    expect(mockFrom).toHaveBeenCalledWith(tableName);
    expect(mockUpdate).toHaveBeenCalledWith({ picture_url: url });
    expect(mockEq).toHaveBeenCalledWith("id", id);
    expect(result).toEqual(updatedData);
  });

  it("throws an error if the update operation fails", async () => {
    const tableName = "questions";
    const id = 3;
    const url = "path/to/picture";
    const errorMessage = "Update failed";
    mockEq.mockRejectedValueOnce(new Error(errorMessage));

    await expect(
      updateQuestionWithPicture(mockSupabaseClient, tableName, id, url)
    ).rejects.toThrow(errorMessage);

    expect(mockFrom).toHaveBeenCalledWith(tableName);
    expect(mockUpdate).toHaveBeenCalledWith({ picture_url: url });
    expect(mockEq).toHaveBeenCalledWith("id", id);
  });
});

describe("setIncorrect", () => {
  it("should set a records is_correct to false", async () => {
    const id = 1;
    const updateData = [{ id: 1, is_correct: false }];
    mockEq.mockResolvedValue({ data: updateData, error: null });

    const result = await set_incorrect(mockSupabaseClient, id);

    expect(mockFrom).toHaveBeenCalledWith("answers");
    expect(mockUpdate).toHaveBeenCalledWith({ is_correct: false });
    expect(mockEq).toHaveBeenCalledWith("id", id);
    expect(result).toEqual(updateData);
  });

  it("should throw an error if the update fails", async () => {
    const id = 1;
    const errorMessage = "Failed to update";
    mockEq.mockRejectedValueOnce(new Error(errorMessage));

    await expect(set_incorrect(mockSupabaseClient, id)).rejects.toThrow(
      errorMessage
    );

    expect(mockFrom).toHaveBeenCalledWith("answers");
    expect(mockUpdate).toHaveBeenCalledWith({ is_correct: false });
    expect(mockEq).toHaveBeenCalledWith("id", id);
  });
});
