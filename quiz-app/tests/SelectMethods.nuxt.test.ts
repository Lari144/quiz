import { describe, it, expect, vi } from "vitest";
import {
  fetchRecordsCards,
  fetchRecords,
  fetchRecordsTest,
  fetchCorrectAnswers,
  fetchRecordsQuestions,
  fetchRecordsCategorie,
  fetchPublicUrl,
  fetchFile,
} from "../components/dbServices";

const dataGeneral = { data: [{ id: 1, text: "abc123" }], error: null };
const dataUser = { data: [{ id: 1, user: "abc123" }], error: null };
const dataCategories = {
  data: [{ name: "hello", description: "abc123" }],
  error: null,
};

const mockEqSelect = vi.fn().mockImplementation((key, value) => {
  if (key === "user") {
    return Promise.resolve({ data: [{ id: 1, user: "abc123" }], error: null });
  } else if (key === "is_correct" && value === false) {
    return Promise.resolve({ data: [{ id: 1, text: "abc123" }], error: null });
  } else if (key === "is_correct" && value === true) {
    return Promise.resolve({ data: [{ id: 1, text: "abc123" }], error: null });
  } else {
    return Promise.resolve({ data: [{ id: 1, text: "abc123" }], error: null });
  }
});

const mockSelect = vi.fn().mockImplementation((columns) => {
  if (columns === "name, description") {
    return Promise.resolve(dataCategories);
  } else {
    return {
      eq: mockEqSelect,
      then: (resolve) => resolve(dataGeneral),
    };
  }
});

const mockFrom = vi.fn().mockReturnValue({ select: mockSelect });

const publicUrlData = {
  data: { publicUrl: "path/to/file" },
  error: null,
};
const listData = { data: [{ name: "image.jpg", size: 1024 }], error: null };

const mockGetPublicUrl = vi.fn().mockResolvedValue(publicUrlData);
const mockList = vi.fn().mockResolvedValue(listData);

const mockStorageFrom = vi.fn().mockImplementation(() => ({
  getPublicUrl: mockGetPublicUrl,
  list: mockList,
}));

const mockSupabaseClient = {
  from: mockFrom,
  storage: {
    from: mockStorageFrom,
  },
};

describe("selectCards", () => {
  it("should fetch cards based on the user ID", async () => {
    const tableName = "test";
    const data = "abc123";
    const result = await fetchRecordsCards(mockSupabaseClient, tableName, data);

    expect(mockFrom).toHaveBeenCalledWith(tableName);
    expect(mockSelect).toHaveBeenCalled();
    expect(mockEqSelect).toHaveBeenCalledWith("user", data);
    expect(result).toEqual([{ id: 1, user: "abc123" }]);
  });

  it("should throw an error if fetching cards fails", async () => {
    const tableName = "test";
    const user = "abc123";
    const errorMessage = "Error fetching cards";
    mockEqSelect.mockRejectedValueOnce(new Error(errorMessage));

    await expect(
      fetchRecordsCards(mockSupabaseClient, tableName, user)
    ).rejects.toThrow(errorMessage);

    expect(mockFrom).toHaveBeenCalledWith(tableName);
    expect(mockSelect).toHaveBeenCalled();
    expect(mockEqSelect).toHaveBeenCalledWith("user", user);
  });
});

describe("selectRecords", () => {
  it("should fetch cards based on the user ID", async () => {
    const tableName = "test";
    const result = await fetchRecords(mockSupabaseClient, tableName);

    expect(mockFrom).toHaveBeenCalledWith(tableName);
    expect(mockSelect).toHaveBeenCalled();
    expect(result).toEqual([{ id: 1, text: "abc123" }]);
  });

  it("should throw an error if fetching records fails", async () => {
    const tableName = "test";
    const errorMessage = "Error fetching records";
    mockSelect.mockReturnValueOnce({
      eq: vi.fn().mockRejectedValueOnce(new Error(errorMessage)),
    });

    await expect(fetchRecords(mockSupabaseClient, tableName)).rejects.toThrow(
      errorMessage
    );

    expect(mockFrom).toHaveBeenCalledWith(tableName);
    expect(mockSelect).toHaveBeenCalled();
  });
});

describe("selectRecordsTest", () => {
  it("should fetch records based on the is_correct", async () => {
    const tableName = "test";
    const result = await fetchRecordsTest(mockSupabaseClient, tableName);

    expect(mockFrom).toHaveBeenCalledWith(tableName);
    expect(mockSelect).toHaveBeenCalled();
    expect(mockEqSelect).toHaveBeenCalledWith("is_correct", false);
    expect(result).toEqual([{ id: 1, text: "abc123" }]);
  });
});

describe("selectCorrectAnswers", () => {
  it("should fetch answers based on the is_correct", async () => {
    const tableName = "test";
    const result = await fetchCorrectAnswers(mockSupabaseClient, tableName);

    expect(mockFrom).toHaveBeenCalledWith(tableName);
    expect(mockSelect).toHaveBeenCalled();
    expect(mockEqSelect).toHaveBeenCalledWith("is_correct", true);
    expect(result).toEqual([{ id: 1, text: "abc123" }]);
  });
});

describe("selectQuestions", () => {
  it("should fetch questions based on the card_id", async () => {
    const data = "1";
    const result = await fetchRecordsQuestions(mockSupabaseClient, data);

    expect(mockSelect).toHaveBeenCalled();
    expect(mockEqSelect).toHaveBeenCalledWith("card_id", data);
    expect(result).toEqual([{ id: 1, text: "abc123" }]);
  });
});

describe("selectRecordsCategorie", () => {
  it("should fetch categories", async () => {
    const tableName = "test";
    const result = await fetchRecordsCategorie(mockSupabaseClient, tableName);

    expect(mockFrom).toHaveBeenCalledWith(tableName);
    expect(mockSelect).toHaveBeenCalledWith("name, description");
    expect(result).toEqual([{ name: "hello", description: "abc123" }]);
  });
});

describe("fetchPublicUrl", () => {
  it("should fetch public URL of a file", async () => {
    const userUid = "user123";
    const file = { name: "photo.jpg" };
    const result = await fetchPublicUrl(mockSupabaseClient, userUid, file);

    expect(mockStorageFrom).toHaveBeenCalledWith("pictures");
    expect(mockGetPublicUrl).toHaveBeenCalledWith(`${userUid}/${file.name}`);
    expect(result).toBe("path/to/file");
  });
});

describe("fetchFile", () => {
  it("should list files in a user's directory", async () => {
    const userUid = "user123";
    const result = await fetchFile(mockSupabaseClient, userUid);

    expect(mockStorageFrom).toHaveBeenCalledWith("pictures");
    expect(mockList).toHaveBeenCalledWith(`${userUid}`);
    expect(result).toEqual([{ name: "image.jpg", size: 1024 }]);
  });
});
