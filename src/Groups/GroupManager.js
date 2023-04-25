import {
    collection,
    addDoc,
    getDocs,
    updateDoc,
    arrayUnion,
    arrayRemove,
    doc,
  } from "firebase/firestore";
import { useState, useEffect } from "react";
import { db, auth } from "../firebase";

function GroupManager() {
    // State variables
    const [groups, setGroups] = useState([]);
    const [newGroupName, setNewGroupName] = useState("");
  
    // Function to create a new group
    const handleCreateGroup = async () => {
      const newGroupRef = await addDoc(collection(db, "groups"), {
        name: newGroupName,
        members: [],
      });
      console.log("New group created with ID: ", newGroupRef.id);
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
  
    // Function to add a user to a group
    const handleJoinGroup = async (groupId) => {
      const groupRef = doc(db, "groups", groupId);
      await updateDoc(groupRef, {
        members: arrayUnion(auth.currentUser.uid),
      });
      console.log(`User ${auth.currentUser.uid} joined group ${groupId}`);
    };
  
    // Function to remove a user from a group
    const handleLeaveGroup = async (groupId) => {
      const groupRef = doc(db, "groups", groupId);
      await updateDoc(groupRef, {
        members: arrayRemove(auth.currentUser.uid),
      });
      console.log(`User ${auth.currentUser.uid} left group ${groupId}`);
    };
  
    // Use effect to get all groups on mount
    useEffect(() => {
      handleGetGroups();
    }, []);  
  
    return (
      <div>
        {/* Render a list of groups */}
        <ul>
          {groups.map((group) => (
            <li key={group.id}>
              <span>{group.data.name}</span>
              <button onClick={() => handleJoinGroup(group.id)}>Join</button>
              <button onClick={() => handleLeaveGroup(group.id)}>Leave</button>
            </li>
          ))}
        </ul>
  
        {/* Form to create a new group */}
        <form onSubmit={handleCreateGroup}>
          <input
            type="text"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
          />
          <button type="submit">Create Group</button>
        </form>
      </div>
    );
  }

export default GroupManager