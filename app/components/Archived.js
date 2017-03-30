/**
 * Created by Daniel on 3/20/2017.
 */
import React from 'react';
import { connect } from 'react-redux';
import SingleArchivedToDo from './SingleArchivedToDo';

export class Archived extends React.Component {
    constructor(props) {
        super(props);
        this.displayArchiveToDos = this.displayArchiveToDos.bind(this);
    }


    displayArchiveToDosOrNothing() {
        var achivedToDos = this.displayArchiveToDos(this.props.user, null);
        if(achivedToDos.length > 0) {
            return achivedToDos.map((todo, i) => {
                return <SingleArchivedToDo key={i} index={i} obj={todo.obj} pathArr = {todo.pathArr} ></SingleArchivedToDo>;
            })
        }
        else {
            var userColor = this.props.user.primaryColor;
            const styles = {
                backgroundColor: userColor,
            };
            return <div className="archivedBack" style={styles}><h1 className="noArchived">You do not have any archived ToDos</h1></div>
        }
    }

    displayArchiveToDos(node, pathArr) {
        var updatedPath;
        var everyToDoInLevel = [];
        if (node.nodes.length > 0) {
            if(pathArr === null)
                updatedPath = [node.name];
            else
                updatedPath = pathArr.concat([node.name]);
            node.nodes.forEach((node) => {
                var subNodeToDos = [];
                var currentNodeToDos = [];
                if(node.nodes) {
                    subNodeToDos = this.displayArchiveToDos(node, updatedPath)
                }
                if(node.todos.length > 0) {
                    updatedPath = updatedPath.concat([node.name]);
                    node.todos.forEach((todo) => {
                        if(todo.completed) {
                            currentNodeToDos.push({
                                pathArr : updatedPath,
                                obj : todo
                            });
                        }
                    });
                }
                for(var i =0; i < subNodeToDos.length; i++) {
                    currentNodeToDos.push(subNodeToDos[i])
                }
                for(var i =0; i < currentNodeToDos.length; i++) {
                    everyToDoInLevel.push(currentNodeToDos[i]);
                }
            });
        }
        return everyToDoInLevel;
    }
    render() {
        return (
            <div>
                {this.displayArchiveToDosOrNothing()}
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