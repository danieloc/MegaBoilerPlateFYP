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
            name : ''
        };
    }
    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleReset(event) {
        event.preventDefault();
        this.props.dispatch(addNodeForm(this.props.user.email,this.props.user.name, this.props.user.picture ||this.props.user.gravatar, this.state.name,this.props.indexList, this.props.depth,  this.props.token));
        this.props.dispatch(hideModal());
    }
    render() {
        return (
            <ModalWrapper {...this.props}
                title="Add Node"
                width={400}
                showOk={false}
            >
                <legend>Adding a Node to level : {this.props.depth}</legend>
                <form onSubmit={this.handleReset.bind(this)}>
                    <div className="form-group">
                        <label htmlFor="name">New Node</label>
                        <input name = "name" id="name" placeholder="New Node" className="form-control" autoFocus value={this.state.name} onChange={this.handleChange.bind(this)}/>
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
        node: state.modals.node,
        indexList: state.modals.indexList,
        depth : state.modals.depth
    };
};

export default connect(mapStateToProps)(AddNodeModal);
