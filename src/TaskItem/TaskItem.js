import Modal from "../Modal/Modal"
import './taskItem.css'


// Definig a functional component that takes 4 props
function TaskItem({onClose, open, title, description}) {

  return (
    <Modal modalLabel='Task Item' onClose={onClose} open={open}>
      <div className='taskItem'>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
    </Modal>
  )
}

export default TaskItem