/* 
Modal component.
Handles open and closing of modals
*/

import './modal.css'

function Modal({open, modalLabel, children, custom_modal, onClose}) {

  // Close Modal function
  const handleClose = (e) => {
    if(e.target.className === 'modalContainer'){
      onClose()
    }
    return null
  }

  // Check if the modal is open and render the modal if true, otherwise render nothing
  if(open) {
    return (
      <div className='modalContainer' onClick={handleClose}>
        <div className= {`modal ${custom_modal}`}>
          <div className='modal__head'>
            <h2>{modalLabel}</h2>
            <span className='modal__close' onClick={onClose}>x</span>
          </div>
          {children}
        </div>
      </div>
    )
  }
  return null
}

export default Modal