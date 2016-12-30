/**
 * Created by Daniel on 11/29/2016.
 */
import React from 'react';
import { connect } from 'react-redux';
import { removeGoal, updateGoal } from '../actions/auth';

class SingleGoal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editing: false
        }
    }


    changeToEdit() {
        this.setState({editing : true});
    }

    saveChanges() {
        this.props.dispatch(updateGoal(this.props.obj._id,  this.props.user.email, newName, this.props.obj.priority, this.props.token));
        this.setState({editing: false});
    }

    removeGoal() {
        this.props.dispatch(removeGoal(this.props.obj._id, this.props.user.email, this.props.token));
    }

    renderForm() {
        return (
            <div className="col-sm-4">
                <div className="panel">
                    <div className="panel-body">
                        <input ref="newtext" placeholder={this.props.obj.name}></input>
                        <button className="btn-success" onClick={() => this.saveChanges()}>Save</button>
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
                        <h3>{this.props.obj.goal}<span onClick={() => this.removeGoal()}
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
        messages: state.messages
    };
};
export default connect(mapStateToProps)(SingleGoal);
