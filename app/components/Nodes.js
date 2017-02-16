/**
 * Created by Daniel on 1/7/2017.
 */
import React from 'react';
import { connect } from 'react-redux'
import NavBar from './NavBar'
import AddNodesForm from './AddNodesForm';
import SingleGoal from './SingleGoal';
import { getDeleteNodeModal, setParent} from '../actions/modals';

class Nodes extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        if(this.props.user.nodes.length > 0) {
            this.props.dispatch(setParent(0, this.props.user.nodes[0]._id, false));
        }
    }
    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    displayToDos() {
        if (this.props.user.nodes.length > 0 && this.props.user.nodes[this.props.parentIndex] != null) {
            if (!this.props.childID) {
                if (this.props.user.nodes[this.props.parentIndex].todos.length > 0) {
                    return this.props.user.nodes[this.props.parentIndex].todos.map((todo, i) => {
                        return <SingleGoal key={i} index={i} obj={todo} parentID={this.props.parentID}
                                           childID={this.props.childID} handleChange={this.handleChange}> </SingleGoal>;
                    });
                }
            }
            else if(this.props.user.nodes[this.props.parentIndex].subnodes[this.props.childIndex]) {
                if (this.props.user.nodes[this.props.parentIndex].subnodes[this.props.childIndex].todos.length > 0) {
                    return this.props.user.nodes[this.props.parentIndex].subnodes[this.props.childIndex].todos.map((todo, i) => {
                        return <SingleGoal key={i} index={i} obj={todo} parentID={this.props.parentID}
                                           childID={this.props.childID} handleChange={this.handleChange}> </SingleGoal>;
                    });
                }
            }
        }else {
            return [];
        }
    }

    getNodeName() {
        if(this.props.user.nodes.length > 0 != null && this.props.user.nodes[this.props.parentIndex] != null) {
            if (this.props.childID && this.props.user.nodes[this.props.parentIndex].subnodes[this.props.childIndex] != null) {
                return this.props.user.nodes[this.props.parentIndex].subnodes[this.props.childIndex].name;
            } else {
                return this.props.user.nodes[this.props.parentIndex].name;
            }
        }
        else {
            return [];
        }
    }
    render() {

        const message = this.props.childID ? "SUB LEVEL NODE: " : "TOP LEVEL NODE: ";

        const addNodesForm = this.props.user.nodes[this.props.parentIndex] ? <AddNodesForm parentNode_ID = {this.props.parentID} childNode_ID = {this.props.childID} name = {message + this.getNodeName()}/> :
            null;
        const deleteNodeButton = this.props.user.nodes.length > 0 ? <button className="btn-danger" onClick={() => {this.props.dispatch(getDeleteNodeModal(this.getNodeName()));}}> Delete Node</button> :
            null;
        const subNodeNavbar = this.props.parentID  && this.props.user.nodes.length >0?
            <NavBar subNode = {true} nodes = {this.props.user.nodes[this.props.parentIndex].subnodes} name = {this.props.user.nodes[this.props.parentIndex].name} /> :
            null;

        return (
            <div>
                <NavBar subNode = {false} nodes = {this.props.user.nodes}/>
                {subNodeNavbar}

                <div className="panel-body">
                    {deleteNodeButton}
                    {addNodesForm}
                    {this.displayToDos()}
                </div>
            </div>

        );
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.auth.user,
        activeModal: state.modals.activeModal,
        parentIndex : state.modals.parentIndex,
        childIndex : state.modals.childIndex,
        parentID: state.modals.parentID,
        childID: state.modals.childID,
    };
};

export default connect(mapStateToProps)(Nodes);
