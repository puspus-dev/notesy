import React, { useEffect, useState } from "react";
import { collection, addDoc, onSnapshot, query, orderBy, Timestamp } from "firebase/firestore";
import { db } from "../firebase";

interface Props {
  user: any;
}

const Notes: React.FC<Props> = ({ user }) => {
  const [notes, setNotes] = useState<any[]>([]);
  const [text, setText] = useState("");

  useEffect(() => {
    const q = query(
      collection(db, "users", user.uid, "notes"),
      orderBy("createdAt", "desc")
    );
    return onSnapshot(q, (snapshot) => {
      setNotes(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
  }, [user.uid]);

  const addNote = async () => {
    if (!text) return;
    await addDoc(collection(db, "users", user.uid, "notes"), {
      text,
      createdAt: Timestamp.now()
    });
    setText("");
  };

  return (
    <div>
      <h3>Your Notes</h3>
      <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Write a note..." />
      <button onClick={addNote}>Save</button>
      <ul>
        {notes.map((n) => (
          <li key={n.id}>{n.text}</li>
        ))}
      </ul>
    </div>
  );
};

export default Notes;
