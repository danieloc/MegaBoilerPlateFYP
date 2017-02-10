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
export function getDeleteNodeModal(parentID, childID) {
    return {
        type: 'DELETE_NODE_MODAL',
        parentID: parentID,
        childID: childID
    };
}