/* 
Add Task component.
Click add task to add a new title and description of task
*/
import Modal from "../Modal/Modal";
import { useState } from "react";
import "./addTask.css";
import { db } from "../firebase"; // Importing the Firebase database configuration
import {
  serverTimestamp,
  doc,
  collection,
  addDoc,
  getDoc
} from "firebase/firestore"; // Importing Firebase Firestore functionalities

function AddTask({ onClose, open, userUid }) {
  // Create state variables for title and description of the tasks
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const userDocRef = doc(db, "users", userUid);
      const tasksCollectionRef = collection(userDocRef, "tasks");
      const newTaskDocRef = await addDoc(tasksCollectionRef, {
        uid: userUid,
        title: title,
        description: description,
        completed: false,
        created: serverTimestamp(),
      });
      console.log("New task created with ID: ", newTaskDocRef.id);
  
      // Get the new task document with taskId
      const taskDocRef = doc(db, "users", userUid, "tasks", newTaskDocRef.id);
      const taskDoc = await getDoc(taskDocRef);
      console.log("Task data: ", taskDoc.data());
  
      onClose();
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <Modal modalLabel="Add Task" onClose={onClose} open={open}>
      {/* Render in the Modal component with props modalLabel, onClose, and open */}
      <form onSubmit={handleSubmit} className="addTask" name="addTask">
        <input
          type="text"
          name="title"
          onChange={(e) => setTitle(e.target.value.toUpperCase())}
          value={title}
          placeholder="Enter title"
        />
        <textarea
          name="description"
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter task description"
          value={description}
        ></textarea>
        <button type="submit" name="addTask">
          Done
        </button>
        {/* Button that will trigger the handleSubmit function when clicked */}
      </form>
    </Modal>
  );
}

export default AddTask


