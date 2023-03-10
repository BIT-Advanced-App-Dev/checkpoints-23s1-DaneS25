import './task.css'
import {useState} from 'react'
import TaskItem from '../TaskItem/TaskItem'
import EditTask from '../EditTask/EditTask'
import { doc, updateDoc, deleteDoc} from "firebase/firestore";
import {db} from '../firebase'

function Task({id, title, description, completed}) {

  // Declare state variables
  const [checked, setChecked] = useState(completed)
  const [open, setOpen] = useState({edit:false, view:false})

  // Close view/edit Modal
  const handleClose = () => {
    setOpen({edit:false, view:false})
  }

  // Function to update firestore
  const handleChange = async () => {
    const taskDocRef = doc(db, 'tasks', id)
    try{
      await updateDoc(taskDocRef, {
        completed: checked
      })
    } catch (err) {
      alert(err)
    }
  }

  // Function to delete a document from firstore
  const handleDelete = async () => {
    const taskDocRef = doc(db, 'tasks', id)
    try{
      await deleteDoc(taskDocRef)
    } catch (err) {
      alert(err)
    }
  }

  return (
    <div className={`task ${checked && 'task--borderColor'}`}>
      <div>
        {/* Checkbox input */}
        <input 
          id={`checkbox-${id}`} 
          className='checkbox-custom'
          name="checkbox" 
          checked={checked}
          onChange={handleChange}
          type="checkbox" />
        {/* Checkbox label */}
        <label 
          htmlFor={`checkbox-${id}`} 
          className="checkbox-custom-label" 
          onClick={() => setChecked(!checked)} ></label>
      </div>
      <div className='task__body'>
        <h2>{title}</h2>
        <p>{description}</p>
        <div className='task__buttons'>
          <div className='task__deleteNedit'>
            {/* Edit button */}
            <button 
              className='task__editButton' 
              onClick={() => setOpen({...open, edit : true})}>
              Edit
            </button>
            {/* Delete button */}
            <button className='task__deleteButton' onClick={handleDelete}>Delete</button>
          </div>
          {/* View button */}
          <button 
            onClick={() => setOpen({...open, view: true})}>
            View
          </button>
        </div>
      </div>

      {/* View task modal */}
      {open.view &&
        <TaskItem 
          onClose={handleClose} 
          title={title} 
          description={description} 
          open={open.view} />
      }

      {/* Edit task modal */}
      {open.edit &&
        <EditTask 
          onClose={handleClose} 
          toEditTitle={title} 
          toEditDescription={description} 
          open={open.edit}
          id={id} />
      }

    </div>
  )
}

export default Task