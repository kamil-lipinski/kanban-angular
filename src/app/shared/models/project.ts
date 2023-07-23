import { Timestamp } from "@angular/fire/firestore";

export interface Project {
  id: string;
  owner: string;
  title: string;
  key: string;
  colorCode: string;
  dateCreated: Timestamp
}
