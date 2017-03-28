/**
 * Created by Daniel on 2/9/2017.
 */
export function hideModal() {
    return {
        type: 'HIDE_MODAL'
    };
}

export function getAddNodeModal(depth) {
    return {
        type: 'NODE_MODAL',
        depth : depth,
    };
}
export function getDeleteNodeModal() {
    return {
        type: 'DELETE_NODE_MODAL',
    };
}
export function getShareNodeModal() {
    return {
        type: 'SHARE_NODE_MODAL',
    };
}
export function getLeaveNodeModal() {
    return {
        type: 'LEAVE_NODE_MODAL',
    };
}

export function setCollaborators(collaboratorList) {
    return {
        type: 'SET_COLLABORATORS',
        collaboratorList: collaboratorList,
    };
}

export function setParent(node, indexList, depth,last) {
    return {
        type: 'SET_NODE',
        node: node,
        indexList: indexList,
        last : last,
        depth: depth
    };
}
export function getWalkThrough() {
    return {
        type: 'WALK_THROUGH_MODAL',
    };
}
export function getInvitationModal() {
    return {
        type: 'INVITATION_MODAL',
    };
}
export function changeWalkThroughState(walkThroughState) {
    return {
        type: 'WALK_THROUGH_STATE',
        state: walkThroughState,
    }
}

export function  walkThroughFinished(email, token) {
    return (dispatch) => {
        return fetch('/account/walkthrough', {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                email: email,
            })
        }).then((response) => {
            if (response.ok) {
                return response.json().then((json) => {
                    dispatch({
                        type: 'WALK_THROUGH_FINISHED',
                        user: json.user
                    });
                });
            } else {
                return response.json().then((json) => {
                    dispatch({
                        type: 'WALK_THROUGH_FINISH_FAILURE'
                    });
                });
            }
        });
    };
}