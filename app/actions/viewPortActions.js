/**
 * Created by Daniel on 2/9/2017.
 */
export function setWidth(width) {
    return {
        type: 'SET_WIDTH',
        width: width
    };
}
export function setHeight(height) {
    return {
        type: 'SET_HEIGHT',
        height: height
    };
}
export function toggleSideBar(state) {
    return {
        type: 'TOGGLE_SIDEBAR',
        toggleState: state
    };
}