
import React from "react";
import Modal from "react-modal";
import { useSelector, useDispatch } from "react-redux";

import { openSignup, closeSignup } from "../../store/modal";
import SignupForm from "./SignupForm";
import "./SignupForm.css";

Modal.setAppElement(document.getElementById("root"));

/******************************************************************************************************************/


function SignupFormModal() {
  const dispatch = useDispatch();

  const signupState = useSelector((state) => state.modal.signupShow);

  const closeModal = () => dispatch(closeSignup());

  return (
    <>
      <button
        id="createAccBtn"
        className="nav-bar-btn"
        onClick={() => dispatch(openSignup())}
      >
        Create Account
      </button>
      <Modal
        isOpen={signupState}
        closeTimeoutMS={500}
        onRequestClose={closeModal}
        contentLabel="Signup Modal"
        overlayClassName="OuterModal"
        className="InnerModal"
      >
        <SignupForm />
      </Modal>
    </>
  );
}


/*******************************************************************************************************************/

export default SignupFormModal;