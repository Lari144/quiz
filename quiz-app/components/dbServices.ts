export const addRecord = async (supabaseClient, tableName, data) => {
  const { error, data: insertedData } = await supabaseClient
    .from(tableName)
    .insert([data]);
  if (error) throw error;
  return insertedData;
};

export const fetchRecords = async (supabaseClient, tableName) => {
  const { error, data } = await supabaseClient.from(tableName).select();
  if (error) throw error;
  return data;
};

export const fetchRecordsCategorie = async (supabaseClient, tableName) => {
  const { error, data } = await supabaseClient
    .from(tableName)
    .select("name, description");
  if (error) throw error;
  return data;
};

export const deleteRecord = async (supabaseClient, tableName, id) => {
  const { error, data } = await supabaseClient
    .from(tableName)
    .delete()
    .eq("id", id);
  if (error) throw error;
  return data;
};

export const updateRecord = async (supabaseClient, tableName, id, newTitle) => {
  const { error, data } = await supabaseClient
    .from(tableName)
    .update({ title: newTitle })
    .eq("id", id);
  if (error) throw error;
  return data;
};

export const addRecordAndSelectId = async (
  supabaseClient,
  tableName,
  new_text
) => {
  const { error, data } = await supabaseClient
    .from(tableName)
    .insert({ text: new_text })
    .select("id");
  if (error) throw error;
  return data[0].id;
};
