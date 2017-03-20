/**
 * Created by Daniel on 3/20/2017.
 */
import React from 'react';
import { connect } from 'react-redux';
import SingleArchivedToDo from './SingleArchivedToDo';

class Archived extends React.Component {
    constructor(props) {
        super(props);
        this.displayToDos = this.displayToDos.bind(this);
    }

    displayToDos(node, pathArr) {
        if (node.nodes.length > 0) {
            var updatedPath = pathArr.concat([node.name]);
            return node.nodes.map((node) => {
                var subNodeToDos = [];
                var currentNodeToDos = [];
                if(node.nodes) {
                    subNodeToDos = this.displayToDos(node, updatedPath)
                }
                if(node.todos.length > 0) {
                    currentNodeToDos = node.todos.map((todo) => {
                        console.log(todo);
                        if (todo.completed)
                            return <SingleArchivedToDo key={todo._id} index={todo._id} obj={todo} pathArr = {updatedPath} ></SingleArchivedToDo>;
                        else return [];
                    });
                }
                return currentNodeToDos.concat(subNodeToDos);
            });
        }
    }
    render() {
        return (
            <div>
                {this.displayToDos(this.props.user, [])}
            </div>
        )
    };
}
const mapStateToProps = (state) => {
    return {
        user : state.auth.user,
    }
};

export default connect(mapStateToProps)(Archived);