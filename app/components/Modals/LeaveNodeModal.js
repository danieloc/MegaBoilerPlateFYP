/**
 * Created by Daniel on 25/03/2017.
 */
import React from 'react';
import { connect } from 'react-redux';
import ModalWrapper from './ModalWrapper';
import { leaveNodeForm} from '../../actions/auth';
import { hideModal} from '../../actions/modals'

class AddNodeModal extends React.Component {

    constructor(props) {
        super(props);
    }

    handleReset(event) {
        event.preventDefault();
        this.props.dispatch(leaveNodeForm(this.props.user.email, this.props.node._id, this.props.indexList[0], this.props.last,this.props.token));
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
                        <label htmlFor="node">Are you sure you want to Leave this node?</label>
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
