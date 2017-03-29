/**
 * Created by Daniel on 3/28/2017.
 */
import { browserHistory } from 'react-router';
export function addNodeForm(email, userName, userImage, nodeTitle, indexList, depth, token) {
    return (dispatch) => {
        return fetch('/nodes', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                email: email,
                userName: userName,
                userImage: userImage,
                nodeTitle: nodeTitle,
                indexList : indexList,
                depth : depth
            })
        }).then((response) => {
            if(response.ok) {
                return response.json().then((json) => {

                    console.log("----------------ADD-RESPONSE-----------------------------------");
                    console.log("User");
                    console.log(json.user);
                    console.log("NodeInformaiton");
                    console.log(json.nodeInformation);
                    console.log("IndexList");
                    console.log(json.indexList);
                    console.log("Last");
                    console.log(json.last);
                    console.log("Depth");
                    console.log(json.depth);

                    dispatch({
                        type: 'SET_NODE',
                        node: json.nodeInformation,
                        indexList: json.indexList,
                        last: json.last,
                        depth: json.depth
                    });
                    dispatch({
                        type: 'ADD_NODE_SUCCESS',
                        messages: 'The node was added successfully',
                        user: json.user
                    });
                });
            }
            else {
                return response.json().then((json) => {
                    dispatch({
                        type: 'ADD_NODE_FAILURE',
                        messages: Array.isArray(json) ? json : [json]
                    });
                });
            }
        });
    };
}

export function deleteNodeForm(email, nodeID, indexList, depth, last, token) {
    return (dispatch) => {
        return fetch('/nodes', {
            method: 'delete',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                email: email,
                _id : nodeID,
                indexList : indexList,
                depth : depth,
                last : last
            })
        }).then((response) => {
            if(response.ok) {
                return response.json().then((json) => {
                    console.log("----------------DELETE-RESPONSE-----------------------------------");
                    console.log("User");
                    console.log(json.user);
                    console.log("NodeInformaiton");
                    console.log(json.nodeInformation);
                    console.log("IndexList");
                    console.log(json.indexList);
                    console.log("Last");
                    console.log(json.last);
                    var length = null;
                    console.log(json.user);
                    if(json.nodeInformation) {
                        length = json.indexList.length;
                    }
                    dispatch({
                        type: 'SET_NODE',
                        node: json.nodeInformation,
                        indexList: json.indexList,
                        last: json.last,
                        depth: length
                    });
                    dispatch({
                        type: 'DELETE_NODE_SUCCESS',
                        messages: 'The node was deleted successfully',
                        user: json.user,
                    });
                });
            }
            else {
                return response.json().then((json) => {
                    dispatch({
                        type: 'DELETE_NODE_FAILURE',
                        messages: Array.isArray(json) ? json : [json]
                    });
                });
            }
        });
    };
}

export function leaveNodeForm(email, nodeID, index, last, token) {
    return (dispatch) => {
        return fetch('/nodes/leave', {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                email: email,
                _id : nodeID,
                index : index,
                last : last
            })
        }).then((response) => {
            if(response.ok) {
                return response.json().then((json) => {
                    console.log("----------------LEAVE-RESPONSE-----------------------------------");
                    console.log("User");
                    console.log(json.user);
                    console.log("NodeInformaiton");
                    console.log(json.nodeInformation);
                    console.log("IndexList");
                    console.log(json.indexList);
                    console.log("Last");
                    console.log(json.last);
                    var length = null;
                    console.log(json.user);
                    if(json.nodeInformation) {
                        length = json.indexList.length;
                    }
                    dispatch({
                        type: 'SET_NODE',
                        node: json.nodeInformation,
                        indexList: json.indexList,
                        last: json.last,
                        depth: length
                    });
                    dispatch({
                        type: 'LEAVE_NODE_SUCCESS',
                        messages: 'The node was left successfully',
                        user: json.user,
                    });
                });
            }
            else {
                return response.json().then((json) => {
                    dispatch({
                        type: 'DELETE_NODE_FAILURE',
                        messages: Array.isArray(json) ? json : [json]
                    });
                });
            }
        });
    };
}

export function shareNodeForm(email, emailToShare, nodeID, isAlreadyCollab, token) {
    return (dispatch) => {
        return fetch('/nodes/share', {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                email: email,
                emailToShare: emailToShare,
                isAlreadyCollab : isAlreadyCollab,
                nodeID : nodeID
            })
        }).then((response) => {
            if(response.ok) {
                return response.json().then((json) => {
                    dispatch({
                        type: 'SHARE_NODE_SUCCESS',
                        messages: [{msg : "The node was shared successfully"}],
                    });
                });
            }
            else {
                return response.json().then((json) => {
                    dispatch({
                        type: 'SHARE_NODE_FAILURE',
                        messages: Array.isArray(json) ? json : [json]
                    });
                });
            }
        });
    };
}

export function acceptInvitation(email, nodeID ,accept, token) {
    return (dispatch) => {
        return fetch('/nodes/accept', {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                email: email,
                nodeID : nodeID,
                accepted: accept,
            })
        }).then((response) => {
            if(response.ok) {
                return response.json().then((json) => {
                    dispatch({
                        type: 'ACCEPT_NODE_SUCCESS',
                        messages: 'The node was deleted successfully',
                        user: json.user,
                    });
                });
            }
            else {
                return response.json().then((json) => {
                    dispatch({
                        type: 'ACCEPT_NODE_FAILURE',
                        messages: Array.isArray(json) ? json : [json]
                    });
                });
            }
        });
    };
}