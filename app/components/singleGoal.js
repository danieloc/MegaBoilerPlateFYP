/**
 * Created by Daniel on 11/29/2016.
 */
import React from 'react';

class SingleGoal extends React.Component {
    render() {
        return (
            <div className="col-sm-4">
                <div className="panel">
                    <div className="panel-body">
                        <h3>{this.props.obj.goal}</h3>
                        <p>{this.props.obj.priority}</p>
                    </div>
                </div>
            </div>
        );
    }
}

export default SingleGoal;
