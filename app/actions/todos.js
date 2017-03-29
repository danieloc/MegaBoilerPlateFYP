/**
 * Created by Daniel on 3/28/2017.
 */
import { browserHistory } from 'react-router';

export function submitNodeToDoForm(state, nodeID,indexList, depth, token) {
    return (dispatch) => {
        dispatch({
            type: 'CLEAR_MESSAGES'
        });
        return fetch('/todos', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                email: state.email,
                todoTitle: state.goal,
                todoPriority:state.priority,
                nodeID : nodeID,
                indexList : indexList,
                depth : depth
            })
        }).then((response) => {
            if (response.ok) {
                return response.json().then((json) => {
                    dispatch({
                        type: 'SET_NODE',
                        node: json.nodeInformation,
                        indexList: indexList,
                        depth: depth
                    });
                    dispatch({
                        type: 'TODO_FORM_SUCCESS',
                        messages: [{msg : "ToDo Submitted"}],
                        user: json.user
                    });
                });
            } else {
                return response.json().then((json) => {
                    dispatch({
                        type: 'TODO_FORM_FAILURE',
                        messages: Array.isArray(json) ? json : [json]
                    });
                });
            }
        });
    };
}

export function removeToDo(email , todoID, nodeID, indexList, depth, token) {
    return (dispatch) => {
        dispatch({
            type: 'CLEAR_MESSAGES'
        });
        return fetch('/todos', {
            method: 'delete',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                email: email,
                todoID: todoID,
                nodeID: nodeID,
                indexList: indexList,
                depth : depth
            })
        }).then((response) => {
            if (response.ok) {
                return response.json().then((json) => {
                    dispatch({
                        type: 'SET_NODE',
                        node: json.nodeInformation,
                        indexList: indexList,
                        depth: depth
                    });
                    dispatch({
                        type: 'DELETE_TODO_SUCCESS',
                        messages: [{msg : "ToDo Deleted"}],
                        user: json.user
                    });
                });
            } else {
                return response.json().then((json) => {
                    dispatch({
                        type: 'DELETE_TODO_FAILURE',
                        messages: Array.isArray(json) ? json : [json]
                    });
                });
            }
        });
    };
}
export function updateToDo(email , todoID, name, priority, archived, nodeID, indexList, depth, token) {
    return (dispatch) => {
        dispatch({
            type: 'CLEAR_MESSAGES'
        });
        return fetch('/todos', {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                email: email,
                todoID: todoID,
                todoTitle: name,
                todoPriority: priority,
                archived: archived,
                nodeID: nodeID,
                indexList: indexList,
                depth : depth
            })
        }).then((response) => {
            if (response.ok) {
                return response.json().then((json) => {
                    dispatch({
                        type: 'SET_NODE',
                        node: json.nodeInformation,
                        indexList: indexList,
                        depth: depth
                    });
                    dispatch({
                        type: 'UPDATE_TODO_SUCCESS',
                        messages: [{msg : "ToDo updated"}],
                        user: json.user
                    });
                });
            } else {
                return response.json().then((json) => {
                    dispatch({
                        type: 'UPDATE_TODO_FAILURE',
                        messages: Array.isArray(json) ? json : [json]
                    });
                });
            }
        });
    };
}


export function unarchiveToDo(email , todoID, token) {
    return (dispatch) => {
        dispatch({
            type: 'CLEAR_MESSAGES'
        });
        return fetch('/todos/unarchive', {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                email: email,
                todoID: todoID,
            })
        }).then((response) => {
            if (response.ok) {
                return response.json().then((json) => {
                    dispatch({
                        type: 'TODO_UNARCHIVED',
                        user: json.user
                    });
                });
            } else {
                return response.json().then((json) => {
                    dispatch({
                        type: 'UPDATE_TODO_FAILURE',
                        messages: Array.isArray(json) ? json : [json]
                    });
                });
            }
        });
    };
}

