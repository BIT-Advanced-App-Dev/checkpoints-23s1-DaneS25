/* 
TaskManager component.
Checks what data is stored in the firestore database
Renders said data into the app
*/

import './taskManager.css'
import Task from '../Task/Task'
import {useState, useEffect} from 'react'
import {collection, query, orderBy, onSnapshot} from "firebase/firestore"
import {db} from '../firebase'
import AddTask from '../AddTask/AddTask'

function TaskManager() {

  const [openAddModal, setOpenAddModal] = useState(false) // Open set to false
  const [tasks, setTasks] = useState([])

  // function to get all tasks from firestore in realtime 
  useEffect(() => {
    const taskColRef = query(collection(db, 'tasks'), orderBy('created', 'desc')) // Firestore query to get all tasks and order by created date in descending order
    const unsubscribe = onSnapshot(taskColRef, (snapshot) => { // Listen for changes to Firestore task collection
      setTasks(snapshot.docs.map(doc => ({ // Update tasks state variable with data from each Firestore document
        id: doc.id,
        data: doc.data()
      })))
    })
    return () => {
      unsubscribe() // Unsubscribe from the onSnapshot listener when the component unmounts
    }
  },[])

  return (
    <div className='taskManager'>
      <header>Task Manager</header>
      <div className='taskManager__container'>
        <button 
          onClick={() => setOpenAddModal(true)}>
          Add task +
        </button>
        <div className='taskManager__tasks'>

          {/* Map over all tasks and create a Task component for each one */}
          {tasks.map((task) => (
            <Task
              id={task.id}
              key={task.id}
              completed={task.data.completed}
              title={task.data.title} 
              description={task.data.description}
            />
          ))}

        </div>
      </div>

      {/* Render the AddTask component if the 'openAddModal' state variable is true */}
      {openAddModal &&
        <AddTask onClose={() => setOpenAddModal(false)} open={openAddModal}/>
      }

    </div>
  )
}

export default TaskManager