/**
 * Created by Daniel on 3/20/2017.
 */

import React from 'react';
import {connect } from 'react-redux'
import { unarchiveToDo } from '../actions/todos'

export class SingleArchivedToDo extends React.Component {
    constructor(props) {
        super(props);
    }

    toggleArchiveToDo() {
        this.props.dispatch(unarchiveToDo(this.props.user.email, this.props.obj._id, this.props.token));
    }
    getPath() {
        return this.props.pathArr.map((pathEl, i) => {
            if(i>0)
                return <button key={i} >{pathEl}</button>
        })
    }

    render() {
        return (<div className="col-sm-4">
                <div className="panel">
                    <div className="panel-body">
                        <h3>{this.props.obj.name}</h3>
                        <p><span>Priority: </span>{this.props.obj.priority}</p>
                        <p><span>Path: {this.getPath()}</span></p>
                        <button className="btn-primary" onClick={() =>this.toggleArchiveToDo()}>Unarchive</button>
                    </div>
                </div>
            </div>
        )
    };
};
const mapStateToProps = (state) => {
    return {
        user : state.auth.user,
        token: state.auth.token
    }
};

export default connect(mapStateToProps)(SingleArchivedToDo);
