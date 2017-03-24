/**
 * Created by Daniel on 1/7/2017.
 */
import React from 'react';
import { connect } from 'react-redux'
import NavBar from './NavBar';
import { getDeleteNodeModal, setParent, getShareNodeModal} from '../actions/modals';

class Nodes extends React.Component {

    constructor(props) {
        super(props);
        this.getNodePath = this.getNodePath.bind(this);
    }

    componentDidMount() {
        if(this.props.user.nodes.length > 0) {
            this.props.dispatch(setParent(this.props.user.nodes[0], [0], 1, false, 1));
        }
    }
    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    getNavBars(node, depth) {
        var lowerNavBars = <div></div>;
        var nodes = null;
        if(node) {
            depth++;
            nodes = node.nodes;
            if (nodes.length > 0 && this.props.indexList && this.props.indexList.length > depth) {
                lowerNavBars = [this.getNavBars(nodes[this.props.indexList[depth - 1]], depth)];
            }
            if (nodes.length > 0 && this.props.indexList && this.props.indexList.length >= depth && this.props.user.email === this.props.node.owner.email) {
                lowerNavBars = [this.getNavBars(nodes[this.props.indexList[depth - 1]], depth)];
            }
        }
        return <div><NavBar nodes = {nodes} depth = {depth} primaryColor = {this.props.user.primaryColor}/> {lowerNavBars} </div>
    }

    getNodePathCollaborators() {
        if(this.props.node && this.props.node.collaborators.length > 0) {
            var collaborators = this.getNodePath(this.props.user.nodes, this.props.indexList, 0, false);
            if (collaborators !== null)
                return (<div><h3>Collaborators</h3>
                    <div className="panel">
                        <div className="panel-body">{collaborators}</div>
                    </div>
                </div>);
            else return null;
        }
        else return null;
    }

    getNodePath(nodes, indexList, n, ownerFound, key) {
        console.log(this.props.user);
        var ownerCollaborator = null;
        var collaborators;
        var nodeCollabs =[];
        if(this.props.user.email !== nodes[indexList[n]].owner.email && ownerFound === false) {
            ownerFound = true;
            ownerCollaborator = [(
                <div key={key++} className="col-sm-1">
                    <img src={nodes[indexList[n]].owner.picture} className="collaboratorImage"/>
                    <p style={{float: 'center'}}>{nodes[indexList[n]].owner.name}</p>
                </div>
            )]
        }
        collaborators = nodes[indexList[n]].collaborators.map((collaborator) => {
            console.log(collaborator.email);
            if(collaborator.email !== this.props.user.email) {
                return [(
                    <div key={key++}>
                        <div className="col-sm-1">
                            <img src={collaborator.picture} className="collaboratorImage"/>
                            <p style={{float: 'center'}}>{collaborator.name}</p>
                        </div>
                    </div>
                )];
            }
            else return null;
        });
        if(ownerCollaborator !== null) {
            nodeCollabs = ownerCollaborator.concat(collaborators);
        }
        else if(collaborators !== null){
            nodeCollabs = nodeCollabs.concat(collaborators);
        }
        else {
            nodeCollabs = null;
        }
        if(this.props.indexList.length > n+1) {
            console.log(nodes[indexList[n]].nodes);
            var lowerNodeColabs = this.getNodePath(nodes[indexList[n]].nodes, indexList, n+1, ownerFound, key);
            if(lowerNodeColabs !== null) {
                nodeCollabs.push(lowerNodeColabs);
            }
        }
        return nodeCollabs;

    }

    render() {
        const deleteNodeButton = this.props.node && this.props.user.email === this.props.node.owner.email ? <button className="btn-danger" onClick={() => {this.props.dispatch(getDeleteNodeModal())}}>Delete Node</button> :
            null;
        const shareNodeButton = this.props.node  && this.props.user.email === this.props.node.owner.email ? <button className="btn-primary" onClick={() => {this.props.dispatch(getShareNodeModal())}}>Share Node</button> :
            null;

        return (
            <div>
                {this.getNavBars(this.props.user, 0)}
                <div>
                    {shareNodeButton}
                    {deleteNodeButton}
                </div>
                {this.getNodePathCollaborators()}
            </div>

        );
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.auth.user,
        activeModal: state.modals.activeModal,
        node : state.modals.node,
        indexList : state.modals.indexList,
        depth : state.modals.depth

    };
};

export default connect(mapStateToProps)(Nodes);
