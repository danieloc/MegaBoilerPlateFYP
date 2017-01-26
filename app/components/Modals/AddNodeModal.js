/**
 * Created by Daniel on 15/01/2017.
 */
import React from 'react';
import { connect } from 'react-redux';
import ModalWrapper from './ModalWrapper';
import {  } from '../../actions/auth'


const styles = {
    title : {
      fontSize: 20,
        textAlign: 'center',
        marginBottom: 24,
    },
};

class AddNodeModal extends React.Component {

    constructor(props) {
        super(props);
    }
    render() {
        const modalTitle = this.props.parentName ? (<h1>Adding a subNode for : {this.props.parentName}</h1>) : (<h1>Adding a top level node</h1>);
        return (
            <ModalWrapper
                title="Add Node"
                width={400}
                showOk={false}
            >
                {modalTitle}
                <textarea></textarea>
            </ModalWrapper>
        );
    }
}



const mapStateToProps = (state) => {
    return {
        parentName: state.modals.parentName,
    };
};

export default connect(mapStateToProps)(AddNodeModal);
