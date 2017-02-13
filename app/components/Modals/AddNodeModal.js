/**
 * Created by Daniel on 15/01/2017.
 */
import React from 'react';
import { connect } from 'react-redux';
import ModalWrapper from './ModalWrapper';
import { addNodeForm } from '../../actions/auth';
import { hideModal } from '../../actions/modals';


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
        this.state = {
            node : ''
        };
    }
    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleReset(event) {
        event.preventDefault();
        this.props.dispatch(addNodeForm(this.props.user.email, this.props.parentName, this.state.node, this.props.token));
        this.props.dispatch(hideModal());
    }
    render() {
        const modalTitle = this.props.parentName ? (<legend>Adding a subNode for : {this.props.parentName}</legend>) : (<h1>Adding a top level node</h1>);
        return (
            <ModalWrapper {...this.props}
                title="Add Node"
                width={400}
                showOk={false}
            >
                {modalTitle}
                <form onSubmit={this.handleReset.bind(this)}>
                    <div className="form-group">
                        <label htmlFor="node">New Node</label>
                        <input name = "node" id="node" placeholder="New Node" className="form-control" autoFocus value={this.state.goal} onChange={this.handleChange.bind(this)}/>
                    </div>
                    <div className="form-group">
                        <button type="submit" className="btn btn-success">Add node</button>
                    </div>
                </form>
            </ModalWrapper>
        );
    }
}



const mapStateToProps = (state) => {
    return {
        user : state.auth.user,
        token: state.auth.token,
        parentName: state.modals.parentName,
    };
};

export default connect(mapStateToProps)(AddNodeModal);
