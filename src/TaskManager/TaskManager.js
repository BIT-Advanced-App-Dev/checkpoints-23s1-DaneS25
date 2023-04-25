/* 
TaskManager component.
Checks what data is stored in the firestore database
Renders said data into the app
*/

import './taskManager.css'
import Task from '../Task/Task'
import {useState, useEffect} from 'react'
import {collection, query, orderBy, onSnapshot} from "firebase/firestore"
import { useNavigate } from "react-router-dom"
import { useAuthState } from "react-firebase-hooks/auth"
import {db, auth} from '../firebase'
import AddTask from '../AddTask/AddTask'
import GroupManager from '../Groups/GroupManager'

function TaskManager() {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");
  }, [user, loading, navigate]);

  const logout = async () => {
    console.log("Before sign out");
    await auth.signOut();
    console.log("After sign out");
    navigate("/");
  };
  
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate("/");
      }
    });
  
    return unsubscribe;
  }, [navigate]);

  const [openAddModal, setOpenAddModal] = useState(false) // Open set to false
  const [tasks, setTasks] = useState([])

  // function to get all tasks from firestore in realtime 
  useEffect(() => {
    if (user && user.uid) {
      const taskColRef = query(collection(db, 'users', user.uid, 'tasks'), orderBy('created', 'desc')); // Firestore query to get all tasks and order by created date in descending order  
      const unsubscribe = onSnapshot(taskColRef, (snapshot) => { // Listen for changes to Firestore task collection
        setTasks(snapshot.docs.map(doc => ({ // Update tasks state variable with data from each Firestore document
          id: doc.id,
          data: doc.data()
        })))
      })
      return () => {
        unsubscribe(); // Unsubscribe from the onSnapshot listener when the component unmounts
      }
    }
  }, [user]);

  return (
    <div className='taskManager'>
      <header>Task Manager</header>
      <button className="logout_btn" onClick={logout}>
        Logout
      </button>
      <div className="userDetails">
        Logged in as
        <div>{user?.email}</div>
      </div>
      <GroupManager />
      <div className='taskManager__container'>
        <button 
          name='Add task +'
          onClick={() => setOpenAddModal(true)}>
          Add task +
        </button>
        <div className='taskManager__tasks'>
  
          {/* Map over all tasks and create a Task component for each one */}
          {tasks.map((task) => (
            <Task
              id={task.id}
              key={task.id}
              completed={task?.data?.completed}
              title={task?.data?.title} 
              description={task?.data?.description}
              userUid={user?.uid}
              taskDocId={task.id}
            />
          ))}
  
        </div>
      </div>
  
      {/* Render the AddTask component if the 'openAddModal' state variable is true */}
      {openAddModal &&
        <AddTask onClose={() => setOpenAddModal(false)} open={openAddModal} userUid={user?.uid}/>
      }
  
    </div>
  )  
}

export default TaskManager