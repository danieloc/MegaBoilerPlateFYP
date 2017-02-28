/**
 * Created by Daniel on 2/9/2017.
 */
import React from 'react';
import { connect } from 'react-redux';
import ModalWrapper from './ModalWrapper';
import { deleteNodeForm } from '../../actions/auth';
import { hideModal} from '../../actions/modals'


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
        this.props.dispatch(deleteNodeForm(this.props.user.email, this.props.node._id, this.props.indexList, this.props.indexList.length, this.props.last,this.props.token));
        this.props.dispatch(hideModal());
    }
    render() {
        return (
            <ModalWrapper {...this.props}
                          title="Delete Node"
                          width={400}
                          showOk={false}
            >
                <form onSubmit={this.handleReset.bind(this)}>
                    <div className="form-group">
                        <label htmlFor="node">Are you sure you want to delete this node?</label>
                        <h3>Node Name: {this.props.node.name}</h3>
                    </div>
                    <div className="form-group">
                        <button type="submit" className="btn btn-success">Confirm</button>
                        <button className="btn btn-danger" onClick={() => this.props.dispatch(hideModal())}>Cancel</button>

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
        indexList : state.modals.indexList,
        depth : state.modals.depth,
        last : state.modals.last
    };
};

export default connect(mapStateToProps)(AddNodeModal);
