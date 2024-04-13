import { describe, it, expect, vi } from "vitest";
import {
  addRecord,
  addRecordAndSelectId,
  addFile,
} from "../components/dbServices";

const mockFrom = vi.fn().mockReturnThis();
const mockInsert = vi.fn().mockResolvedValue({ data: { id: 1 }, error: null });
const mockSelect = vi
  .fn()
  .mockResolvedValue({ data: [{ id: 1 }], error: null });
const mockUpload = vi.fn().mockResolvedValue({
  data: { Key: "12314" },
  error: null,
});
const mockStorageFrom = vi.fn().mockReturnValue({
  upload: mockUpload,
});

const mockSupabaseClient = {
  from: mockFrom.mockReturnValue({
    insert: mockInsert,
    select: mockSelect,
  }),
};

const mockStorage = {
  from: mockStorageFrom,
};

const mockSupabaseClientStorage = {
  storage: mockStorage,
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

//AddRecordAndSelectID

describe("addFile", () => {
  it("should upload a file and return data", async () => {
    const userUid = "user123";
    const file = new File(["content"], "test.png", { type: "image/png" });
    const data = await addFile(mockSupabaseClientStorage, userUid, file);

    expect(mockStorageFrom).toHaveBeenCalledWith("pictures");
    expect(mockUpload).toHaveBeenCalledWith(`${userUid}/${file.name}`, file, {
      upsert: true,
    });
    expect(data).toEqual({ Key: "12314" });
  });
});
