export type Message = {
  id: string;
  topic: string;
  payload: string;
  createdAt: Date;
  diff: string;
  retained: boolean;
};
