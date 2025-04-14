import { Timestamp } from "firebase/firestore";

export interface Entry {
  id: string;
  title: string;
  content: string;
  challengeId?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  collectionId: string;
  userId: string;
}
