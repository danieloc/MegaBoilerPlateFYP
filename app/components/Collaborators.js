/**
 * Created by Daniel on 25/03/2017.
 */
import React from 'react';
import { connect } from 'react-redux';

class Collaborators extends React.Component {

    constructor(props) {
        super(props);
    }

    getNodePathCollaborators() {
        return this.props.collaboratorList.map((collaborator, i) => {
            return (
                <div key={i}>
                    <div className="col-sm-1">
                        <img src={collaborator.picture} className="collaboratorImage"/>
                        <p style={{float: 'center'}}>{collaborator.name}</p>
                    </div>
                </div>)
        });
    }

    render() {

        return (
            <div>
                <h3>Collaborators</h3>
                <div className="panel">
                    <div className="panel-body">
                        {this.getNodePathCollaborators()}
                    </div>
                </div>
            </div>

        );
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.auth.user,
        node : state.modals.node,
        indexList : state.modals.indexList,
        collaboratorList: state.modals.collaboratorList
    };
};

export default connect(mapStateToProps)(Collaborators);
