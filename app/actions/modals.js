/**
 * Created by Daniel on 2/9/2017.
 */
export function hideModal() {
    return {
        type: 'HIDE_MODAL'
    };
}

export function getAddNodeModal(parentName) {
    return {
        type: 'NODE_MODAL',
        parentName: parentName
    };
}
export function getDeleteNodeModal(nodeName, parentID, childID) {
    return {
        type: 'DELETE_NODE_MODAL',
        nodeName: nodeName,
        parentID: parentID,
        childID: childID
    };
}
export function setParentID(parentID) {
    return {
        type: 'SET_PARENT',
        parentID: ''
    }
}