/**
 * Created by Daniel on 1/7/2017.
 */
import React from 'react';
import { connect } from 'react-redux'
import NavBar from './NavBar';
import { getDeleteNodeModal, setParent, getShareNodeModal} from '../actions/modals';

class Nodes extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        if(this.props.user.nodes.length > 0) {
            this.props.dispatch(setParent(this.props.user.nodes[0], [0], 1, false));
        }
    }
    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    getNavBars(node, depth) {
        var lowerNavBars = <div></div>;
        var nodes = null;
            if(node) {
                depth++;
                nodes = node.nodes;
                if (nodes.length > 0 && this.props.indexList && this.props.indexList.length >= depth) {
                    lowerNavBars = this.getNavBars(nodes[this.props.indexList[depth - 1]], depth)
                }
            }
        return <div><NavBar nodes = {nodes} depth = {depth} primaryColor = {this.props.user.primaryColor}/> {lowerNavBars} </div>
    }
    render() {
        const deleteNodeButton = this.props.user.nodes.length > 0 ? <button className="btn-danger" onClick={() => {this.props.dispatch(getDeleteNodeModal())}}>Delete Node</button> :
            null;
        const shareNodeButton = this.props.user.nodes.length > 0 ? <button className="btn-primary" onClick={() => {this.props.dispatch(getShareNodeModal())}}>Share Node</button> :
            null;

        return (
            <div>
                {this.getNavBars(this.props.user, 0)}
                <div>
                    {shareNodeButton}
                    {deleteNodeButton}
                </div>
            </div>

        );
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.auth.user,
        activeModal: state.modals.activeModal,
        node : state.modals.node,
        indexList : state.modals.indexList,
        depth : state.modals.depth

    };
};

export default connect(mapStateToProps)(Nodes);
