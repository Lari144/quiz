export const addRecord = async (supabaseClient, tableName, data) => {
  const { error, data: insertedData } = await supabaseClient
    .from(tableName)
    .insert([data]);
  if (error) throw error;
  return insertedData;
};

export const deleteQuestion = async (supabaseClient, tableName, id) => {
  const { error, data } = await supabaseClient
    .from(tableName)
    .delete()
    .eq("card_id", id);
  if (error) throw error;
  return data;
};

export const deleteAnswer = async (supabaseClient, tableName, id) => {
  const { error, data } = await supabaseClient
    .from(tableName)
    .delete()
    .eq("question_id", id);
  if (error) throw error;
  return data;
};

export const fetchRecordsCards = async (supabaseClient, tableName, user) => {
  const { error, data } = await supabaseClient
    .from(tableName)
    .select()
    .eq("user", user);
  if (error) throw error;
  return data;
};

export const fetchRecords = async (supabaseClient, tableName) => {
  const { error, data } = await supabaseClient.from(tableName).select();
  if (error) throw error;
  return data;
};

export const fetchRecordsTest = async (supabaseClient, tableName) => {
  const { error, data } = await supabaseClient
    .from(tableName)
    .select()
    .eq("is_correct", false);
  console.log(data);
  if (error) throw error;
  return data;
};

export const fetchCorrectAnswers = async (supabaseClient, tableName) => {
  const { error, data } = await supabaseClient
    .from(tableName)
    .select()
    .eq("is_correct", true);
  console.log(data);
  if (error) throw error;
  return data;
};

export const deleteCards = async (supabaseClient, cardId) => {
  const questions = await fetchRecordsQuestions(supabaseClient, cardId);
  for (const question of questions) {
    await deleteAnswer(supabaseClient, "answers", question.id);
  }
  await deleteQuestion(supabaseClient, "questions", cardId);
  await deleteRecord(supabaseClient, "cards", cardId);
};

export const fetchRecordsQuestions = async (supabaseClient, card_id) => {
  const { error, data } = await supabaseClient
    .from("questions")
    .select()
    .eq("card_id", card_id);
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

export const set_incorrect = async (supabaseClient, id) => {
  const { error, data } = await supabaseClient
    .from("answers")
    .update({ is_correct: false })
    .eq("id", id);
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

export const updateAnswer = async (supabaseClient, tableName, id) => {
  const { error, data } = await supabaseClient
    .from(tableName)
    .update({ is_correct: true })
    .eq("id", id);
  if (error) throw error;
  return data;
};

export const updateQuestionAndAnswer = async (
  supabaseClient,
  tableName,
  id,
  newText
) => {
  const { error, data } = await supabaseClient
    .from(tableName)
    .update({ text: newText })
    .eq("id", id);
  if (error) throw error;
  return data;
};

export const updateQuestionWithPicture = async (
  supabaseClient,
  tableName,
  id,
  url
) => {
  const { error, data } = await supabaseClient
    .from(tableName)
    .update({ picture_url: url })
    .eq("id", id);
  if (error) throw error;
  return data;
};

export const fetchPublicUrl = async (supabaseClient, userUid, file) => {
  const { data, error } = await supabaseClient.storage
    .from("pictures")
    .getPublicUrl(`${userUid}/${file.name}`);
  console.log(file.name);
  if (error) throw error;
  return data.publicUrl;
};

export const addRecordAndSelectId = async (
  supabaseClient,
  tableName,
  new_text,
  card_id
) => {
  const { error, data } = await supabaseClient
    .from(tableName)
    .insert({ text: new_text, card_id: card_id })
    .select("id");
  if (error) throw error;
  return data[0].id;
};

export const addFile = async (supabaseClient, user_uid, file) => {
  const { data, error } = await supabaseClient.storage
    .from("pictures")
    .upload(`${user_uid}/${file.name}`, file, {
      upsert: true,
    });
  if (error) throw error;
  return data;
};

export const fetchFile = async (supabaseClient, user_uid) => {
  const { data, error } = await supabaseClient.storage
    .from("pictures")
    .list(`${user_uid}`);
  if (error) throw error;
  return data;
};
