/**
 * Created by Daniel on 16/02/2017.
 */
import React from 'react';
import {connect} from 'react-redux';
import { Link } from 'react-router';
import { getAddNodeModal, setParent, changeDepth} from '../actions/modals';

class NavBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            depth : props.depth
        }
    }

    addNodeModal() {
        this.props.dispatch(getAddNodeModal());
    }


    getNodes() {
        if(this.props.nodes && this.props.nodes.length > 0 && this.props.node) {
            console.log("Depth " + this.state.depth);
            return this.props.nodes.map((node, i) => {
                var className = "inActive";
                if(this.state.depth -1 < this.props.indexList.length) {
                    if(this.props.indexList[this.state.depth -1] === i)
                    {
                        className = "active"
                    }
                }
                else {
                    className = this.props.node._id === node._id ? "active" : "inActive";
                }
                return <li className={className} key={i} value={i}
                           onClick={() => this.changeCurrentNode(i, node)}><Link>{node.name}</Link></li>
            });
        }
        else {
            return []
        }
    }

    changeCurrentNode(i, node) {
        //Adding variable last because, there is no connection between the modal and view other than the modal reducer.
        //This reducer does not have access to the user reducer, but needs to change when the nodes is deleted so that
        //the nodes page does not try to get index n+1 when only n index's exist
        if (this.state.depth > this.props.indexList.length) {
            console.log("IndexList!");
            console.log(this.props.indexList.concat(i));
            console.log("IndexListDone!");
            this.props.dispatch(setParent(node, this.props.indexList));
        }
        else {
            this.props.dispatch(setParent(node, this.props.indexList));
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
        node : state.modals.node,
        indexList : state.modals.indexList
    }
}

export default connect(mapStateToProps)(NavBar)

