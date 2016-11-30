/**
 * Created by Daniel on 11/29/2016.
 */
import React from 'react';

class SingleGoal extends React.Component {
    render() {
        return (
            <div>
                <h1>Goal with Title : {this.props.obj.goal}</h1>
                <h2>And Priority : {this.props.obj.priority}</h2>
            </div>
        );
    }
}

export default SingleGoal;
