/* 
Edit Task component.
Click edit to edit an existing task in the list.
*/

import Modal from "../Modal/Modal"
import {useState} from 'react'
import './editTask.css'
import { doc, updateDoc } from "firebase/firestore"; // Import updateDoc function from Firestore library
import {db} from '../firebase'

function EditTask({open, onClose, toEditTitle, toEditDescription, id, userUid}) {

  // Set initial state variables 'toEdit'
  const [title, setTitle] = useState(toEditTitle)
  const [description, setDescription] = useState(toEditDescription)

  // Function to update firestore
  const handleUpdate = async (e) => {
    e.preventDefault()
    const taskDocRef = doc(db, `users/${userUid}/tasks`, id); // Get a reference to the document to update using the ID passed as a prop
    try{
      await updateDoc(taskDocRef, { // Update the document with the new values for title and description
        title: title,
        description: description
      })
      onClose()
    } catch (err) {
      alert(err)
    }
    
  }

  return (
    <Modal modalLabel='Edit Task' onClose={onClose} open={open}>
      <form onSubmit={handleUpdate} className='editTask' name='editTask'>
        <input type='text' name='title' onChange={(e) => setTitle(e.target.value.toUpperCase())} value={title}/>
        <textarea onChange={(e) => setDescription(e.target.value)} value={description}></textarea>
        <button type='submit' name='editTask'>Edit</button> {/* Button that will trigger the handleUpdate function when clicked */}
      </form> 
    </Modal>
  )
}

export default EditTask