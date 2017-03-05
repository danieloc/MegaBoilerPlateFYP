/**
 * Created by Daniel on 11/29/2016.
 */
import React from 'react';
import { connect } from 'react-redux';
import { removeToDo, updateToDo } from '../actions/auth';

class SingleGoal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editing: false,
            priority: "Low"
        }
    }


    changeToEdit() {
        this.setState({editing : true});
    }

    saveChanges() {
        var newName = this.refs.newText.value;
        var newPriority;
        if(this.refs.lowPriorRef.checked){
            newPriority = "Low";
        }else if(this.refs.medPriorRef.checked){
            newPriority = "Medium";
        }else if(this.refs.highPriorRef.checked){
            newPriority = "High";
        }
        console.log(newName);
        this.props.dispatch(updateToDo(this.props.user.email, this.props.obj._id, newName, newPriority, this.props.nodeID, this.props.indexList, this.props.depth, this.props.token));
        this.setState({editing: false});
    }

    removeGoal() {
        this.props.dispatch(removeToDo(this.props.user.email, this.props.obj._id, this.props.nodeID, this.props.indexList, this.props.depth, this.props.token));
    }

    renderForm() {
        return (
            <div className="col-sm-4">
                <div className="panel">
                    <div className="panel-body">
                        <input ref="newText" placeholder={this.props.obj.name}></input>

                        <button className="btn-success" onClick={() => this.saveChanges()}>Save</button>
                    </div>
                    <div className = "form-group">
                        <label className="radio-inline" >
                            <input ref = "lowPriorRef" type="radio" name="priority" value="Low" checked={this.state.priority === 'Low'} onChange={this.props.handleChange.bind(this)}/><span>Low</span>
                        </label>
                        <label className="radio-inline">
                            <input ref = "medPriorRef" type="radio" name="priority" value="Medium" checked={this.state.priority === 'Medium'} onChange={this.props.handleChange.bind(this)}/><span>Medium</span>
                        </label>
                        <label className="radio-inline">
                            <input ref = "highPriorRef" type="radio" name="priority" value="High" checked={this.state.priority === 'High'} onChange={this.props.handleChange.bind(this)}/><span>High</span>
                        </label>
                    </div>
                </div>
            </div>
        );
    }

    renderNormal() {
        return (
            <div className="col-sm-4">
                <div className="panel">
                    <div className="panel-body">
                        <h3>{this.props.obj.name}<span onClick={() => this.removeGoal()}
                                                       className="glyphicon glyphicon-trash pull-right"></span></h3>
                        <p>{this.props.obj.priority}<span className="glyphicon glyphicon-wrench pull-right"
                                                          onClick={() =>this.changeToEdit()}></span></p>
                    </div>
                </div>
            </div>
        );
    }

    render() {
        if (!this.state.editing) {
            return this.renderNormal();
        }
        else {
                return this.renderForm();
            }
        }
}
const mapStateToProps = (state) => {
    return {
        token: state.auth.token,
        user: state.auth.user,
        messages: state.messages,
        nodeID: state.modals.node._id,
        indexList: state.modals.indexList,
        depth: state.modals.depth
    };
};
export default connect(mapStateToProps)(SingleGoal);
