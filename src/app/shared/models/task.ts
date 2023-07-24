import { Timestamp } from "firebase/firestore";

export interface Task {
  id: string;
  title: string;
  description: string;
  dateCreated: Timestamp;
  // dueTo: Timestamp;
}
