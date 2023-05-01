import {
  collection,
  addDoc,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import './groupManager.css'

function GroupManager() {
  // State variables
  const [groups, setGroups] = useState([]);
  const [newGroupName, setNewGroupName] = useState("");

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
    const membersData = membersSnapshot.docs.map((doc) => doc.data());
    console.log("Members of group", groupId, ":", membersData);
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
          </li>
        ))}
      </ul>
    </div>
  );
}

export default GroupManager;
