/**
 * Created by Daniel on 12/03/2017.
 */

import React from 'react';
import ModalWrapper from './ModalWrapper';
import {hideModal, changeWalkThroughState} from '../../actions/modals';
import { walkThroughFinished } from '../../actions/auth'
import {connect} from 'react-redux';

class WalkThroughModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stage : 1,
        }
    }
    getPreviousButton() {
        if(this.props.walkThroughState > 1) {
            return <button className="btn btn-danger" onClick={() => {this.props.dispatch(changeWalkThroughState(this.props.walkThroughState - 1))}} >Previous</button>
        }
    }
    getNextButton() {
        if(this.props.walkThroughState < 3) {
            return <button className="btn btn-success"  onClick={() => {this.props.dispatch(changeWalkThroughState(this.props.walkThroughState + 1))}}>Next</button>
        }
        if(this.props.walkThroughState === 3) {
            return <button className="btn btn-success"  onClick={() => {this.props.dispatch(hideModal()); this.props.dispatch(walkThroughFinished(this.props.email, this.props.token))} }>Done</button>
        }
    }
    getWalkThroughPage() {
        if(this.props.walkThroughState === 1)
            return <div><legend>Bubblesort is a mindmapping application</legend>
                <p>A Persons brain processes visual information far quicker than it does text,
                    which makes Mind Maps a great tool. As a result of organising information visually,
                    it’s simple to understand tricky concepts and engage more with the ideas that you’ve been thinking about.
                    You can visually represent the links between concepts, you can plan your ideas more easily -
                    share them or explore concepts in greater depth.
                </p>
            </div>;
        if(this.props.walkThroughState === 2)
            return <div><legend>Organisation is a powerful tool!</legend>
                <p>Mind mapping is simple tool and its power stems directly from its simplicity.
                    Using this tool you may quickly and easily structure out their ideas in to separate and branching trees.
                    Mind mapping helps you to plan and to feel like you’ve conceptualise every aspect needed.
                    Because you can visually see it – the order, the hierarchy and the overlap.
                    It’s all there on one page, in this visual network and it’s beautiful. They can clarify just about anything.
                </p>
            </div>;
        if(this.props.walkThroughState === 3)
            return <div><legend>Start Creating beautiful Mindmaps now!</legend>
                <img src='img/mindmap.PNG' width={300} height = {280}/>
                </div>;
    }

    render() {
        return(
            <ModalWrapper title="Welcome to Bubblesort"
                          width={400}
                          showOk={false}
            >
                {this.getWalkThroughPage()}
                {this.getPreviousButton()}
                {this.getNextButton()}
            </ModalWrapper>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        walkThroughState : state.modals.walkThroughModalState,
        email : state.auth.user.email,
        token : state.auth.token
    }
};

export default connect(mapStateToProps)(WalkThroughModal);