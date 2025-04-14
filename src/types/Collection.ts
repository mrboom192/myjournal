import { Timestamp } from "firebase/firestore";

export interface Collection {
  id: string;
  color: string;
  createdAt: Timestamp;
  icon: string;
  name: string;
  userId: string;
}
