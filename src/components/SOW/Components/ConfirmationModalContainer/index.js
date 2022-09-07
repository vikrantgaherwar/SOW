import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {
  actionCloneSafeModalCancel,
  actionCloneSafeModalConfirm,
} from "../../Redux/Actions/CloneSafe";
import ConfirmationModal from "../ConfirmationModal";

const ConfirmationModalContainer = () => {
  const { cloneMessage, modalShow, type } = useSelector((state) => ({
    cloneMessage: state.cloneSafe.confirmModalMessage,
    modalShow: state.cloneSafe.confirmModalShow,
    type: state.cloneSafe.confirmModalShow,
  }));

  const dispatch = useDispatch();

  const handleConfirm = () => {
    dispatch(actionCloneSafeModalConfirm());
  };
  const handleCancel = () => {
    dispatch(actionCloneSafeModalCancel());
  };
  return (
    <>
      {modalShow && (
        <ConfirmationModal
          message={cloneMessage}
          show={modalShow}
          handleClose={handleCancel}
          handleConfirm={handleConfirm}
        />
      )}
    </>
  );
};

export default ConfirmationModalContainer;
