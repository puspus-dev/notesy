import React, { useEffect, useState } from "react";
import { collection, addDoc, onSnapshot, query, orderBy, Timestamp } from "firebase/firestore";
import { db } from "../firebase";

interface Props {
  user: { uid: string } | null;
}

interface Note {
  id: string;
  text: string;
  createdAt: Timestamp;
}

const Notes: React.FC<Props> = ({ user }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [text, setText] = useState("");

  useEffect(() => {
    if (!user?.uid) return;

    const q = query(
      collection(db, "users", user.uid, "notes"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setNotes(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Note)));
    });

    return () => unsubscribe();
  }, [user?.uid]);

  const addNote = async () => {
    if (!text || !user?.uid) return;

    await addDoc(collection(db, "users", user.uid, "notes"), {
      text,
      createdAt: Timestamp.now()
    });

    setText("");
  };

  return (
    <div>
      <h3>Your Notes</h3>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write a note..."
      />
      <button type="button" onClick={addNote}>Save</button>
      <ul>
        {notes.map((n) => (
          <li key={n.id}>{n.text}</li>
        ))}
      </ul>
    </div>
  );
};

export default Notes;
