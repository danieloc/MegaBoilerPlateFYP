/**
 * Created by Daniel on 10/30/2016.
 */
import React from 'react';
import { connect } from 'react-redux'
import { submitGoalForm } from '../actions/auth';
import Messages from './Messages';

class addGoals extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: props.user.email,
            name: props.user.name,
            gender: props.user.gender,
            goal: '',
            priority: ''
        }
    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleReset(event) {
        event.preventDefault();
        this.props.dispatch(submitGoalForm(this.state, this.props.token));
        this.state.goal = '';
        this.state.priority = '';
    }

    render() {
        return (
            <div className="container">
                <div className="panel">
                    <div className="panel-body">
                        <Messages messages={this.props.messages}/>
                        <form onSubmit={this.handleReset.bind(this)}>
                            <legend>Create Goal</legend>
                            <div className="form-group">
                                <label htmlFor="goal">New Goal</label>
                                <input name = "goal" id="goal" placeholder="New goal" className="form-control" autoFocus value={this.state.goal} onChange={this.handleChange.bind(this)}/>
                            </div>
                            <div className = "form-group">
                                <label className="radio-inline">
                                    <input type="radio" name="priority" value="Low" checked={this.state.priority === 'Low'} onChange={this.handleChange.bind(this)}/><span>Low</span>
                                </label>
                                <label className="radio-inline">
                                    <input type="radio" name="priority" value="Medium" checked={this.state.priority === 'Medium'} onChange={this.handleChange.bind(this)}/><span>Medium</span>
                                </label>
                                <label className="radio-inline">
                                    <input type="radio" name="priority" value="High" checked={this.state.priority === 'High'} onChange={this.handleChange.bind(this)}/><span>High</span>
                                </label>
                            </div>
                            <div className="form-group">
                                <button type="submit" className="btn btn-success">Add goal</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        token: state.auth.token,
        user: state.auth.user,
        messages: state.messages
    };
};
export default connect(mapStateToProps)(addGoals);