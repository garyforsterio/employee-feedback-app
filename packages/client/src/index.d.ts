export interface User {
  _id: string;
  name: string;
  email: string;
  averageRating: number;
}

export interface Request {
  _id: string;
  completed: boolean;
  createdAt: string;
  evaluatorId: string;
  evaluateeId: string;
}

export interface Review {
  _id?: string;
  requestId: string;
  rating: number;
  feedback: string;
}
