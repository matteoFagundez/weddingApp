import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

type AttendanceInput = {
  name: string;
  family: string;
  guests: string;
  comments?: string;
};

export async function createAttendance(data: AttendanceInput) {
  await addDoc(collection(db, "attendances"), {
    ...data,
    createdAt: serverTimestamp(), 
  });
}
