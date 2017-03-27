import React from 'react';
import {connect} from 'react-redux';

import AddNodeModal from './AddNodeModal';
import DeleteNodeModal from './DeleteNodeModal';
import ShareNodeModal from './ShareNodeModal';
import LeaveNodeModal from './LeaveNodeModal';
import WalkThroughModal from './WalkThroughModal';
import InvitationModal from './InvitationModal';

import { MODALS, } from '../../constants.js';

class Modal extends React.Component {
    constructor(props) {
        super(props);
    };
    render() {
        var ModalBody;
        switch (this.props.activeModal) {
            case MODALS.NODE_MODAL :
                ModalBody = AddNodeModal;
                break;
            case MODALS.DELETE_NODE_MODAL :
                ModalBody = DeleteNodeModal;
                break;
            case MODALS.SHARE_NODE_MODAL :
                ModalBody = ShareNodeModal;
                break;
            case MODALS.LEAVE_NODE_MODAL :
                ModalBody = LeaveNodeModal;
                break;
            case MODALS.WALK_THROUGH_MODAL :
                ModalBody = WalkThroughModal;
                break;
            case MODALS.INVITATION_MODAL :
                ModalBody = InvitationModal;
                break;
            default :
                return null;
        }

        return (
            <ModalBody
            />
        );
    }
}

const mapStateToProps = (state) => {
    return {
        activeModal: state.modals.activeModal,
    };
};

export default connect(mapStateToProps)(Modal);
