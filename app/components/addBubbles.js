/**
 * Created by Daniel on 10/30/2016.
 */
import React from 'react';
import { connect } from 'react-redux'
import { submitBubbleForm } from '../actions/auth';
import Messages from './Messages';

class addBubbles extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: props.user.email,
            name: props.user.name,
            gender: props.user.gender,
            location: props.user.location,
            website: props.user.website,
            gravatar: props.user.gravatar,
            goal: '',
        }
        console.log(this.props.token);
    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleReset(event) {
        event.preventDefault();
        this.props.dispatch(submitBubbleForm(this.state, this.props.token));
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
                            <div className="form-group">
                                <button type="submit" className="btn btn-success">Add goal</button>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="container">
                    <div className="panel">
                        <h1></h1>
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
export default connect(mapStateToProps)(addBubbles);