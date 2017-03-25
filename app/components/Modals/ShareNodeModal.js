/**
 * Created by Daniel on 3/21/2017.
 */
import React from 'react';
import { connect } from 'react-redux';
import ModalWrapper from './ModalWrapper';
import { shareNodeForm } from '../../actions/auth';
import { hideModal} from '../../actions/modals';

class ShareNodeModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            email : '',
        };
    }
    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleReset(event) {
        event.preventDefault();
        var isAlreadyCollab = false;
        console.log(this.props.collaboratorList);
        for(var i = 0; i < this.props.collaboratorList.length; i++) {
            if(this.state.email === this.props.collaboratorList[i]) {
                console.log("Star");
                //The email address is already a collaborator
                isAlreadyCollab = true;
            }
        }
        if(!isAlreadyCollab) {
            this.props.dispatch(shareNodeForm(this.props.user.email, this.state.email, this.props.node._id, this.props.token));
            this.props.dispatch(hideModal());
        }
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
                        <label htmlFor="node">Who would you like to share this node with?</label>
                        <h3>Node Name: {this.props.node.name}</h3>
                        <input name = "email" id="email" placeholder="myFriendsEmailAddress@TheirEmail.com" className="form-control" autoFocus value={this.state.email} onChange={this.handleChange.bind(this)}/>
                    </div>
                    <div className="form-group">
                        <button type="submit" className="btn btn-success">Share</button>
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
        last : state.modals.last,
        collaboratorList: state.modals.collaboratorList,
    };
};

export default connect(mapStateToProps)(ShareNodeModal);
