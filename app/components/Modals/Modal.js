import React from 'react';
import {connect} from 'react-redux';

import AddNodeModal from './AddNodeModal';
import DeleteNodeModal from './DeleteNodeModal';
import WalkThroughModal from './WalkThroughModal';

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
            case MODALS.WALK_THROUGH_MODAL :
                ModalBody = WalkThroughModal;
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
