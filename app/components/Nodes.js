/**
 * Created by Daniel on 1/7/2017.
 */
import React from 'react';
import { connect } from 'react-redux'
import NavBar from './NavBar';
import Collaborators from './Collaborators';
import { getDeleteNodeModal, setParent, getShareNodeModal, getLeaveNodeModal, setCollaborators} from '../actions/modals';

class Nodes extends React.Component {

    constructor(props) {
        super(props);
        this.getNodeCollaborators = this.getNodeCollaborators.bind(this);
    }

    componentDidMount() {
        if(this.props.user.nodes.length > 0) {
            this.props.dispatch(setParent(this.props.user.nodes[0], [0], 1, false, 1));
            var newCollaborators = this.getNodeCollaborators(this.props.user.nodes, [0], 0, false, [],0);
            console.log(newCollaborators);
            this.props.dispatch(setCollaborators(newCollaborators));
        }
    }
    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    getNodeCollaborators(nodes, indexList, n, ownerFound) {
        var nodeCollabs =[];
        if(this.props.user.email !== nodes[indexList[n]].owner.email && ownerFound === false) {
            console.log(1);
            nodeCollabs.push(nodes[indexList[n]].owner);
            ownerFound = true;
        }
        nodes[indexList[n]].collaborators.map((collaborator, i) => {
            if(collaborator.email !== this.props.user.email) {
                console.log(2);
                nodeCollabs.push(collaborator);
            }
        });
        if(indexList.length > n+1) {
            console.log(3);
            var lowerNodeCollabs = this.getNodeCollaborators(nodes[indexList[n]].nodes, indexList, n+1, ownerFound);
            if(lowerNodeCollabs !== null) {
                console.log("LOWER NODES");
                var allTags = [];
                allTags.push.apply(allTags, nodeCollabs);
                allTags.push.apply(allTags, lowerNodeCollabs);
                nodeCollabs = allTags;
            }
        }
        return nodeCollabs;
    }

    getNavBars(node, depth, i) {
        var lowerNavBars = <div></div>;
        var nodes = null;
        if(node) {
            depth++;
            nodes = node.nodes;
            if (nodes.length > 0 && this.props.indexList && this.props.indexList.length > depth) {
                lowerNavBars = [this.getNavBars(nodes[this.props.indexList[depth - 1]], depth, i++)];
            }
            else if (nodes.length > 0 && this.props.indexList && this.props.indexList.length >= depth && this.props.node && (this.props.user.email === this.props.node.owner.email||nodes[this.props.indexList[depth - 1]].nodes.length > 0)) {
                lowerNavBars = [this.getNavBars(nodes[this.props.indexList[depth - 1]], depth, i++)];
            }
        }
        return <div key={i}><NavBar getNodeCollaborators = {this.getNodeCollaborators} nodes = {nodes} depth = {depth} primaryColor = {this.props.user.primaryColor}/> {lowerNavBars} </div>
    }

    render() {
        const deleteNodeButton = this.props.node && this.props.user.email === this.props.node.owner.email ? <button className="btn-danger" onClick={() => {this.props.dispatch(getDeleteNodeModal())}}>Delete Node</button> :
            null;
        const shareNodeButton = this.props.node  && this.props.user.email === this.props.node.owner.email ? <button className="btn-primary" onClick={() => {this.props.dispatch(getShareNodeModal())}}>Share Node</button> :
            null;
        const leaveNodeButton = this.props.node  && this.props.user.email !== this.props.node.owner.email ? <button className="btn-danger" onClick={() => {this.props.dispatch(getLeaveNodeModal())}}>Leave Node</button> :
            null;
        const collaborators = this.props.node ? <Collaborators /> : null;

        return (
            <div>
                {this.getNavBars(this.props.user, 0, 0)}
                <div>
                    {shareNodeButton}
                    {deleteNodeButton}
                    {leaveNodeButton}
                </div>
                {collaborators}
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
