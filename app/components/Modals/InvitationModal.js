/**
 * Created by Daniel on 3/22/2017.
 */
import React from 'react';
import { connect } from 'react-redux';
import ModalWrapper from './ModalWrapper';
import { acceptInvitation } from '../../actions/nodes';

class InvitationModal extends React.Component {

    constructor(props) {
        super(props);
    }
    getNodesInvitedTo() {
        console.log(this.props.user.nodes);
        return this.props.user.invitations.map((node, i) => {
            console.log(node);
            return (
                <div className="panel" key={i} >
                    <div className="panel-body">
                    <div style={{float: 'left'}}>
                        <span>{node.name}</span>
                    </div>
                <div style={{float: 'right'}}>
                    <button className="btn btn-success" onClick={() => this.props.dispatch(acceptInvitation(this.props.user.email, node._id, true, this.props.token))}><span className="glyphicon glyphicon-ok"></span></button>
                    <button className="btn btn-danger" onClick={() => this.props.dispatch(acceptInvitation(this.props.user.email, node._id, false, this.props.token))}><span className="glyphicon glyphicon-remove"></span></button>
                </div>
                        </div>
            </div>)
        });
    }
    render() {
        return (
            <ModalWrapper {...this.props}
                          title="Invitation Acceptation"
                          width={400}
                          showOk={false}
            >
                    <div className="form-group">
                        <label htmlFor="node">You have been inveted to join</label>
                        {this.getNodesInvitedTo()}
                    </div>
            </ModalWrapper>
        );
    }
}



const mapStateToProps = (state) => {
    return {
        user : state.auth.user,
        token: state.auth.token,
    };
};

export default connect(mapStateToProps)(InvitationModal);
