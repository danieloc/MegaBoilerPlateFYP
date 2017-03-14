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
export function changeWalkThroughState(walkThroughState) {
    return {
        type: 'WALK_THROUGH_STATE',
        state: walkThroughState,
    }
}