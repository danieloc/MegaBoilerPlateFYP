/**
 * Created by Daniel on 16/02/2017.
 */
import React from 'react';
import {connect} from 'react-redux';
import { Link } from 'react-router';
import { getAddNodeModal, setParent, setChild } from '../actions/modals';

class NavBar extends React.Component {

    addNodeModal() {
        if(this.props.subNode) {
            this.props.dispatch(getAddNodeModal(this.props.name));
        }
        else {
            this.props.dispatch(getAddNodeModal(null));
        }
    }


    getNodes() {
        console.log(this.props.subNode);
        if(this.props.nodes.length > 0) {
                return this.props.nodes.map((node, i) => {
                    var className = "inActive";
                    if(!this.props.subNode) {
                        className = this.props.parentID === node._id ? "active" : "inActive";
                    }
                    else if(this.props.subNode){
                        className = this.props.childID === node._id ? "active" : "inActive";
                    }
                    return <li className={className} key={i} value={i}
                               onClick={() => this.changeCurrentNode(i, node._id)}><Link>{node.name}</Link></li>
                });
        }
        else {
            return []
        }
    }

    changeCurrentNode(i, nodeID) {
        //Adding variable last because, there is no connection between the modal and view other than the modal reducer.
        //This reducer does not have access to the user reducer, but needs to change when the nodes is deleted so that
        //the nodes page does not try to get index n+1 when only n index's exist
        var last = false;
        if( i === this.props.nodes.length - 1 && i>0) {
            last = true;
        }
        if(this.props.subNode) {

            this.props.dispatch(setChild(i, nodeID, last));
        }
        else {
            this.props.dispatch(setParent(i, nodeID, last));
        }
    }

    render() {
        return (
        <div>
            <nav className="navbar navbar-default navbar-static-top" style={{zIndex:1}} >
                <div id="navbar" className="navbar-collapse collapse">
                    <ul className="nav navbar-nav">
                        {this.getNodes()}
                        <li><Link onClick={() => this.addNodeModal()}><span className = "glyphicon glyphicon-plus-sign"></span></Link></li>
                    </ul>
                </div>
            </nav>
        </div>
        )
    }
}
const mapStateToProps =(state) => {
    return {
        parentIndex : state.modals.parentIndex,
        childIndex : state.modals.childIndex,
        parentID: state.modals.parentID,
        childID: state.modals.childID,
    }
}

export default connect(mapStateToProps)(NavBar)

