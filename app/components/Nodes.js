/**
 * Created by Daniel on 1/7/2017.
 */
import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux'
import AddNodesForm from './AddNodesForm';
import SingleGoal from './SingleGoal';

class Nodes extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            'parentNode_ID' : props.user.nodes[0]._id,
            'topNode' : props.user.nodes[0],
            'topNodeIndex' : 0,
            'childNode_ID' : null,
            'subNode' : null,
            'subNodeIndex' : null
        };
    }

    changeCurrentNode(i) {
        console.log(i);
        if(this.state.topNodeIndex === i){
            this.setState({
                'subNode' : null,
                'subNodeIndex' : null,
                'childNode_ID' : null
            });
        }
        else {
            this.setState({
                'topNode': this.props.user.nodes[i],
                'childNode_ID' : null,
                'topNodeIndex' : i,
                'subNode' : null,
                'subNodeIndex' : null,
                'parentNode_ID' : this.props.user.nodes[i]._id
            });
        }
    }
    changeCurrentSubNode(i) {
        console.log(i);
        this.setState({
            'subNode': this.state.topNode.subnodes[i],
            'childNode_ID': this.state.topNode.subnodes[i]._id,
            'subNodeIndex' : i
        });
    }
    getNodes() {
        if(this.props.user.nodes.length > 0) {
            return this.props.user.nodes.map((node, i) => {
                return <li key = {i} index = {i} value={i} onClick={() => this.changeCurrentNode(i)}><Link>{node.name}</Link></li>
            });
        }
        else {
            return []
        }
    }
    getSubNodes() {
        if(this.state.topNode.subnodes.length > 0) {
            return this.state.topNode.subnodes.map((node, i) => {
                return <li key = {i} index = {i} value={i} onClick={() => this.changeCurrentSubNode(i)}><Link>{node.name}</Link></li>
            });
        }
        else {
            return []
        }
    }



    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    displayToDos() {
    if(!this.state.childNode_ID) {
        if (this.state.topNode.todos.length > 0) {
            return this.props.user.nodes[this.state.topNodeIndex].todos.map((todo, i) => {
                return <SingleGoal key={i} index={i} obj={todo} parentID = {this.state.parentNode_ID} childID = {this.state.childNode_ID} handleChange={this.handleChange}> </SingleGoal>;
            });
        }
    }
    else {
        if (this.state.subNode.todos.length > 0) {
            return this.props.user.nodes[this.state.topNodeIndex].subnodes[this.state.subNodeIndex].todos.map((todo, i) => {
                return <SingleGoal key={i} index={i} obj={todo} parentID = {this.state.parentNode_ID} childID = {this.state.childNode_ID} handleChange={this.handleChange}> </SingleGoal>;
            });
        }
    }
}

    render() {

        const message = this.state.childNode_ID ? "SUB LEVEL NODE: " + this.state.subNode.name
            : "TOP LEVEL NODE: " + this.state.topNode.name;



        return (
            <div>
                <nav className="navbar navbar-default navbar-static-top">
                    <div id="navbar" className="navbar-collapse collapse">
                        <ul className="nav navbar-nav">
                            {this.getNodes()}
                        </ul>
                    </div>
                </nav>
                <nav className="navbar navbar-default navbar-static-top">
                    <div id="navbar" className="navbar-collapse collapse">
                        <ul className="nav navbar-nav">
                            {this.getSubNodes()}
                        </ul>
                    </div>
                </nav>
                <div className="panel-body">
                    <AddNodesForm parentNode_ID = {this.state.parentNode_ID} childNode_ID = {this.state.childNode_ID} name = {message}/>
                    {this.displayToDos()}
                </div>
            </div>

        );
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.auth.user
    };
};

export default connect(mapStateToProps)(Nodes);
