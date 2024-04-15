export interface Box {
  id: number;
  title: string;
  category_id: number;
  user: string | number;
  category?: string;
  showInput?: any;
  name?: string;
}
