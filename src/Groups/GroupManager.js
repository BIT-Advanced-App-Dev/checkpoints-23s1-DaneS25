import {
  collection,
  addDoc,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  query,
  where
} from "firebase/firestore";
import { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import './groupManager.css'

function GroupManager() {
  // State variables
  const [groups, setGroups] = useState([]);
  const [newGroupName, setNewGroupName] = useState("");
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState(null);

  // Function to create a new group
  const handleCreateGroup = async () => {
    const groupDocRef = await addDoc(collection(db, "groups"), {
      name: newGroupName,
    });
  
    // create subcollection for members
    await setDoc(
      doc(db, "groups", groupDocRef.id, "members", auth.currentUser.uid),
      {
        groupId: groupDocRef.id,
        userId: auth.currentUser.uid,
      }
    );
  
    console.log("New group created with ID: ", groupDocRef.id);
    setNewGroupName("");
  };

  // Function to get all groups
  const handleGetGroups = async () => {
    const querySnapshot = await getDocs(collection(db, "groups"));
    const groupsData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      data: doc.data(),
    }));
    setGroups(groupsData);
  };

  // Function to get the members of a group
  const handleGetGroupMembers = async (groupId) => {
    const membersSnapshot = await getDocs(
      collection(db, "groups", groupId, "members")
    );
    const membersData = membersSnapshot.docs.map(async (doc) => {
      const tasksRef = collection(
        db,
        "groups",
        groupId,
        "tasks",
        "tasks",
        doc.data().userId
      );
      const tasksSnapshot = await getDocs(tasksRef);
      const tasksData = tasksSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return {
        ...doc.data(),
        tasks: tasksData,
      };
    });
    console.log(
      "Members of group",
      groupId,
      ":",
      await Promise.all(membersData)
    );
  };  

  // Function to add a user to a group
  const handleJoinGroup = async (groupId) => {
    const groupRef = doc(db, "groups", groupId);
    const membersRef = collection(groupRef, "members");
    await addDoc(membersRef, { userId: auth.currentUser.uid });
  
    console.log(`User ${auth.currentUser.uid} joined group ${groupId}`);
  };  

  // Function to remove a user from a group
  const handleLeaveGroup = async (groupId, userId) => {
    const groupRef = doc(db, "groups", groupId);
    const memberRef = doc(groupRef, "members", userId);
    await deleteDoc(memberRef);
    console.log("Left group:", groupId);
  };

  // Function to add a task to a group
  const handleAddTask = async (e, groupId, newTaskTitle, newTaskDescription) => {
    e.preventDefault();
    const groupRef = doc(db, "groups", groupId);
  
    // Check if the user is a member of the group
    const membersRef = collection(groupRef, "members");
    const memberQuerySnapshot = await getDocs(
      query(membersRef, where("userId", "==", auth.currentUser.uid))
    );
    if (memberQuerySnapshot.empty) {
      console.log("User is not a member of this group.");
      return;
    }
  
    // Add the task to the group's tasks subcollection
    const tasksRef = collection(groupRef, "tasks");
    await addDoc(tasksRef, {
      title: newTaskTitle,
      description: newTaskDescription,
      completed: false,
    });
  
    // Fetch all the tasks for the group and update the tasks state variable
    const tasksQuerySnapshot = await getDocs(tasksRef);
    const tasksData = tasksQuerySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    const updatedGroups = groups.map((group) => {
      if (group.id === groupId) {
        return {
          ...group,
          tasks: tasksData,
        };
      }
      return group;
    });
    setGroups(updatedGroups);
  
    setNewTaskTitle("");
    setNewTaskDescription("");
  };  
  
  // Use effect to get all groups on mount
  useEffect(() => {
    handleGetGroups();
  }, []);

  return (
    <div className="container">
      {/* Form to create a new group */}
      <p className="title">GROUPS</p>
      <form className="form" onSubmit={handleCreateGroup}>
        <input
          className="input"
          type="text"
          value={newGroupName}
          onChange={(e) => setNewGroupName(e.target.value)}
        />
        <button className="submit" type="submit">Create Group</button>
      </form>
      {/* Render a list of groups */}
      <ul className="list">
        {groups.map((group) => (
          <li key={group.id}>
            <span className="name">{group.data.name}</span>
            <button className="join" onClick={() => handleJoinGroup(group.id)}>Join</button>
            <button className="view" onClick={() => handleGetGroupMembers(group.id)}>
              View Members
            </button>
            <button className="leave" onClick={() => handleLeaveGroup(group.id, auth.currentUser.uid)}>
              Leave
            </button>
            {/* Added form to create a task */}
            {selectedGroupId === group.id && (
              <form className="task-form" onSubmit={(e) => handleAddTask(e, selectedGroupId, newTaskTitle, newTaskDescription)}>
                <input
                  className="task-input"
                  type="text"
                  placeholder="Task Title"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                />
                <input
                  className="task-input"
                  type="text"
                  placeholder="Task Description"
                  value={newTaskDescription}
                  onChange={(e) => setNewTaskDescription(e.target.value)}
                />
                <button className="submit" type="submit">Submit</button>
              </form>
            )}
            <button className="submit" onClick={() => setSelectedGroupId(group.id)}>
              Add Task
            </button>
            {group.tasks && (
            <ul className="task-list">
              {group.tasks.map((task) => (
                <p key={task.id}>
                  <p>TITLE</p>
                  <span>{task.title}</span>
                  <p>DESCRIPTION</p>
                  <span>{task.description}</span>
                  <p> </p>
                </p>
              ))}
            </ul>
          )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default GroupManager;
