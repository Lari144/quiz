export const addRecord = async (supabaseClient, tableName, data) => {
  const { error, data: insertedData } = await supabaseClient
    .from(tableName)
    .insert([data]);
  if (error) throw error;
  return insertedData;
};

export const fetchRecords = async (supabaseClient, tableName) => {
  const { error, data } = await supabaseClient
    .from(tableName)
    .select("title, category_id");
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
