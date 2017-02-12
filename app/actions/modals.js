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
export function setParent(parentIndex, parentID) {
    return {
        type: 'SET_PARENT_NODE',
        parentIndex: parentIndex,
        parentID: parentID
    }
}
export function setChild(childIndex, childID) {
    return {
        type: 'SET_CHILD_NODE',
        childIndex: childIndex,
        childID: childID
    }
}