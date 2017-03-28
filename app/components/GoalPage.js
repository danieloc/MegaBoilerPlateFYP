/**
 * Created by Daniel on 1/7/2017.
 */
import React from 'react';
import { connect } from 'react-redux'
import Nodes from './Nodes';
import AddNodesForm from './AddNodesForm';
import SingleGoal from './SingleGoal';

export class GoalPage extends React.Component {

    constructor(props) {
        super(props);
    }
    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    displayToDos() {
        if (this.props.node) {
            if (this.props.node.todos.length > 0) {
                return this.props.node.todos.map((todo, i) => {
                    if(!todo.completed)
                        return <SingleGoal key={i} index={i} obj={todo} nodeID = {this.props.node._id} handleChange={this.handleChange}> </SingleGoal>;
                });
            }
        }else {
            return [];
        }
    }
    render() {

        const message = this.props.childID ? "SUB LEVEL NODE: " : "TOP LEVEL NODE: ";

        const addNodesForm = this.props.node ? <AddNodesForm nodeID = {this.props.node._id} name = {message + this.props.node.name}/> :
            null;

        return (
            <div>
                <div className="panel-body">
                    <Nodes />
                    {addNodesForm}
                    {this.displayToDos()}
                </div>
            </div>

        );
    }
}

const mapStateToProps = (state) => {
    return {
        node : state.modals.node,
    };
};

export default connect(mapStateToProps)(GoalPage);
