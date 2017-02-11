/**
 * Created by Daniel on 1/7/2017.
 */
import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux'
import AddNodesForm from './AddNodesForm';
import SingleGoal from './SingleGoal';
import { getAddNodeModal } from '../actions/modals';
import { getDeleteNodeModal} from '../actions/modals';

class Nodes extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            'parentNode_ID' : props.user.nodes[0]._id,
            'topNodeIndex' : 0,
            'childNode_ID' : null,
            'subNodeIndex' : null,
            'showModal': false
        };
    }

    changeCurrentNode(i) {
        if(this.state.topNodeIndex === i){
            this.setState({
                'subNodeIndex' : null,
                'childNode_ID' : null
            });
        }
        else {
            this.setState({
                'childNode_ID' : null,
                'topNodeIndex' : i,
                'subNodeIndex' : null,
                'parentNode_ID' : this.props.user.nodes[i]._id
            });
        }
    }
    changeCurrentSubNode(i) {
        console.log(this.props.user.nodes[this.state.topNodeIndex]);
        this.setState({
            'childNode_ID': this.props.user.nodes[this.state.topNodeIndex].subnodes[i]._id,
            'subNodeIndex' : i
        });
    }
    getNodes() {
        if(this.props.user.nodes.length > 0) {
            return this.props.user.nodes.map((node, i) => {
                return <li key = {i} value={i} onClick={() => this.changeCurrentNode(i)}><Link>{node.name}</Link></li>
            });
        }
        else {
            return []
        }
    }
    getSubNodes() {
        if(this.props.user.nodes[this.state.topNodeIndex].subnodes.length > 0) {
            return this.props.user.nodes[this.state.topNodeIndex].subnodes.map((node, i) => {
                return <li key = {i} value={i} onClick={() => this.changeCurrentSubNode(i)}><Link>{node.name}</Link></li>
            });
        }
        else {
            return []
        }
    }

    addNodeModal(isSubLevel) {
        if(isSubLevel) {
            this.props.dispatch(getAddNodeModal(this.props.user.nodes[this.state.topNodeIndex].name));
        }
        else {
            this.props.dispatch(getAddNodeModal(null));
        }
    }



    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    displayToDos() {
    if(!this.state.childNode_ID) {
        if (this.props.user.nodes[this.state.topNodeIndex].todos.length > 0) {
            return this.props.user.nodes[this.state.topNodeIndex].todos.map((todo, i) => {
                return <SingleGoal key={i} index={i} obj={todo} parentID = {this.state.parentNode_ID} childID = {this.state.childNode_ID} handleChange={this.handleChange}> </SingleGoal>;
            });
        }
    }
    else {
        if (this.props.user.nodes[this.state.topNodeIndex].subnodes[this.state.subNodeIndex].todos.length > 0) {
            return this.props.user.nodes[this.state.topNodeIndex].subnodes[this.state.subNodeIndex].todos.map((todo, i) => {
                return <SingleGoal key={i} index={i} obj={todo} parentID = {this.state.parentNode_ID} childID = {this.state.childNode_ID} handleChange={this.handleChange}> </SingleGoal>;
            });
        }
    }
}
    render() {

        const message = this.state.childNode_ID ? "SUB LEVEL NODE: " : "TOP LEVEL NODE: ";
        const nodeName = this.state.childNode_ID ? this.props.user.nodes[this.state.topNodeIndex].subnodes[this.state.subNodeIndex].name
            : this.props.user.nodes[this.state.topNodeIndex].name;



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
                <nav className="navbar navbar-default navbar-static-top" style={{zIndex:1}}>
                    <div id="navbar" className="navbar-collapse collapse">
                        <ul className="nav navbar-nav">
                            {this.getSubNodes()}
                            <li><Link onClick={() => this.addNodeModal(true)} ><span className = "glyphicon glyphicon-plus-sign" onClick={() => this.addNodeModal()}></span></Link></li>
                        </ul>
                    </div>
                </nav>
                <div className="panel-body">
                    <button className="btn-danger" onClick={() => {this.props.dispatch(getDeleteNodeModal(nodeName, this.state.parentNode_ID, this.state.childNode_ID));}}> Delete Node</button>
                    <AddNodesForm parentNode_ID = {this.state.parentNode_ID} childNode_ID = {this.state.childNode_ID} name = {message + nodeName}/>
                    {this.displayToDos()}
                </div>
            </div>

        );
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.auth.user,
        activeModal: state.modals.activeModal
    };
};

export default connect(mapStateToProps)(Nodes);
