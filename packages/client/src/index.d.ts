// TODO: link to backend
export interface User {
  _id: string;
  name: string;
  email: string;
}

export interface Request {
  _id: string;
  completed: boolean;
  createdAt: string;
  evaluatorId: string;
  evaluateeId: string;
}
