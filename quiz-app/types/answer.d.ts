export interface Answer {
  id: number;
  question_id: number;
  text: string;
  is_correct: boolean;
  showInput?: any;
}
