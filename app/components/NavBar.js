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
        if (this.state.depth > this.props.indexList.length) {
            this.props.dispatch(setParent(node, this.props.indexList));
        }
        else {
            var newIndexList =  this.props.indexList;
            newIndexList.slice(this.state.depth);
            newIndexList[this.state.depth -1] = i;
            console.log(newIndexList);
            this.props.dispatch(setParent(node, newIndexList));
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

