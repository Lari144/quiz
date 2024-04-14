export interface Record {
  id: number;
  text: string;
  is_correct?: boolean;
  user?: string;
  title?: string;
  picture_url?: string;
}
