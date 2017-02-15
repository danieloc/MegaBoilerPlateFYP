/**
 * Created by Daniel on 1/7/2017.
 */
import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux'
import AddNodesForm from './AddNodesForm';
import SingleGoal from './SingleGoal';
import { getAddNodeModal, getDeleteNodeModal, setParent, setChild } from '../actions/modals';

class Nodes extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        if(this.props.user.nodes.length > 0) {
            this.props.dispatch(setParent(0, this.props.user.nodes[0]._id, false));
        }
    }

    changeCurrentNode(i, parentNodeID) {
        //Adding variable last because, there is no connection between the modal and view other than the modal reducer.
        //This reducer does not have access to the user reducer, but needs to change when the nodes is deleted so that
        //the nodes page does not try to get index n+1 when only n index's exist
        var last = false;
        if( i === this.props.user.nodes.length - 1 && i>0) {
            last = true;
        }
        this.props.dispatch(setParent(i, parentNodeID, last));
    }
    changeCurrentSubNode(i, childNodeID) {
        var last = false;
        if( i === this.props.user.nodes[this.props.parentIndex].subnodes.length - 1 && i>0) {
            last = true;
        }
        this.props.dispatch(setChild(i, childNodeID, last));
    }
    getNodes() {
        if(this.props.user.nodes.length > 0) {
            return this.props.user.nodes.map((node, i) => {
                return <li key = {i} value={i} onClick={() => this.changeCurrentNode(i, node._id)}><Link>{node.name}</Link></li>
            });
        }
        else {
            return []
        }
    }
    getSubNodes() {
        if(this.props.user.nodes.length > 0  && this.props.user.nodes[this.props.parentIndex]) {
            if (this.props.user.nodes[this.props.parentIndex].subnodes.length > 0) {
                return this.props.user.nodes[this.props.parentIndex].subnodes.map((node, i) => {
                    return <li key={i} value={i} onClick={() => this.changeCurrentSubNode(i, node._id)}>
                        <Link>{node.name}</Link></li>
                });
            } else {
                return []
            }
        }
        else {
            return []
        }
    }

    addNodeModal(isSubLevel) {
        if(isSubLevel) {
            this.props.dispatch(getAddNodeModal(this.props.user.nodes[this.props.parentIndex].name));
        }
        else {
            this.props.dispatch(getAddNodeModal(null));
        }
    }



    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    displayToDos() {
        if (this.props.user.nodes.length > 0 && this.props.user.nodes[this.props.parentIndex] != null) {
            if (!this.props.childID) {
                if (this.props.user.nodes[this.props.parentIndex].todos.length > 0) {
                    return this.props.user.nodes[this.props.parentIndex].todos.map((todo, i) => {
                        return <SingleGoal key={i} index={i} obj={todo} parentID={this.props.parentID}
                                           childID={this.props.childID} handleChange={this.handleChange}> </SingleGoal>;
                    });
                }
            }
            else if(this.props.user.nodes[this.props.parentIndex].subnodes[this.props.childIndex]) {
                if (this.props.user.nodes[this.props.parentIndex].subnodes[this.props.childIndex].todos.length > 0) {
                    return this.props.user.nodes[this.props.parentIndex].subnodes[this.props.childIndex].todos.map((todo, i) => {
                        return <SingleGoal key={i} index={i} obj={todo} parentID={this.props.parentID}
                                           childID={this.props.childID} handleChange={this.handleChange}> </SingleGoal>;
                    });
                }
            }
        }else {
            return [];
        }
    }

    getNodeName() {
        if(this.props.user.nodes.length > 0 != null && this.props.user.nodes[this.props.parentIndex] != null) {
            if (this.props.childID && this.props.user.nodes[this.props.parentIndex].subnodes[this.props.childIndex] != null) {
                return this.props.user.nodes[this.props.parentIndex].subnodes[this.props.childIndex].name;
            } else {
                return this.props.user.nodes[this.props.parentIndex].name;
            }
        }
        else {
            return [];
        }
    }
    render() {

        const message = this.props.childID ? "SUB LEVEL NODE: " : "TOP LEVEL NODE: ";

        const addNodesForm = this.props.user.nodes[this.props.parentIndex] ? <AddNodesForm parentNode_ID = {this.props.parentID} childNode_ID = {this.props.childID} name = {message + this.getNodeName()}/> :
            null;
        const deleteNodeButton = this.props.user.nodes.length > 0 ? <button className="btn-danger" onClick={() => {this.props.dispatch(getDeleteNodeModal(this.getNodeName()));}}> Delete Node</button> :
            null;
        const subNodeNavbar = this.props.parentID ?
            <nav className="navbar navbar-default navbar-static-top" style={{zIndex:1}}>
                <div id="navbar" className="navbar-collapse collapse">
                    <ul className="nav navbar-nav">
                        {this.getSubNodes()}
                        <li><Link onClick={() => this.addNodeModal(true)} ><span className = "glyphicon glyphicon-plus-sign" onClick={() => this.addNodeModal()}></span></Link></li>
                    </ul>
                </div>
            </nav> :
            null;

        return (
            <div>
                <nav className="navbar navbar-default navbar-static-top" style={{zIndex:1}} >
                    <div id="navbar" className="navbar-collapse collapse">
                        <ul className="nav navbar-nav">
                            {this.getNodes()}
                            <li><Link onClick={() => this.addNodeModal(false)}><span className = "glyphicon glyphicon-plus-sign"></span></Link></li>
                        </ul>
                    </div>
                </nav>
                {subNodeNavbar}

                <div className="panel-body">
                    {deleteNodeButton}
                    {addNodesForm}
                    {this.displayToDos()}
                </div>
            </div>

        );
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.auth.user,
        activeModal: state.modals.activeModal,
        parentIndex : state.modals.parentIndex,
        childIndex : state.modals.childIndex,
        parentID: state.modals.parentID,
        childID: state.modals.childID,
    };
};

export default connect(mapStateToProps)(Nodes);
