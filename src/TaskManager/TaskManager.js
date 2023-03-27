/* 
TaskManager component.
Checks what data is stored in the firestore database
Renders said data into the app
*/

import './taskManager.css'
import Task from '../Task/Task'
import {useState, useEffect, useCallback} from 'react'
import {collection, query, orderBy, onSnapshot, getDocs, where} from "firebase/firestore"
import { useNavigate } from "react-router-dom"
import { useAuthState } from "react-firebase-hooks/auth"
import {db, auth} from '../firebase'
import AddTask from '../AddTask/AddTask'

function TaskManager() {
  const [user, loading] = useAuthState(auth);
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const fetchUserName = useCallback(async () => {
    try {
      if (user && user.uid) {
        const q = query(collection(db, "users"), where("uid", "==", user.uid));
        const doc = await getDocs(q);
        const data = doc.docs[0].data();
        setName(data.name);
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while fetching user data");
    }
  }, [user, setName]);
  
  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");
    fetchUserName();
  }, [user, loading, navigate, fetchUserName]);

  const logout = () => {
    auth.signOut();
    navigate("/");
  };

  const [openAddModal, setOpenAddModal] = useState(false) // Open set to false
  const [tasks, setTasks] = useState([])

  // function to get all tasks from firestore in realtime 
  useEffect(() => {
    const taskColRef = query(collection(db, 'users', user?.uid, 'tasks'), orderBy('created', 'desc')) // Firestore query to get all tasks and order by created date in descending order
    const unsubscribe = onSnapshot(taskColRef, (snapshot) => { // Listen for changes to Firestore task collection
      setTasks(snapshot.docs.map(doc => ({ // Update tasks state variable with data from each Firestore document
        id: doc.id,
        data: doc.data()
      })))
    })
    return () => {
      unsubscribe() // Unsubscribe from the onSnapshot listener when the component unmounts
    }
  },[user?.uid])

  return (
    <div className='taskManager'>
      <header>Task Manager</header>
      <button className="logout_btn" onClick={logout}>
        Logout
      </button>
      <div className="userDetails">
        Logged in as
        <div>{name}</div>
        <div>{user?.email}</div>
      </div>
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