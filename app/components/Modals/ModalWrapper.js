/**
 * Created by Daniel on 15/01/2017.
 */
import React from 'react';
import { hideModal} from '../../actions/auth';
import { connect } from 'react-redux';

const styles = {
    back: {
        position: 'fixed',
        display: 'flex',
        flexFlow: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.618)',
        zIndex: 100,
        cursor: 'default',
    },
    panelAboveSpacer: {
        flex: '2 0 auto',
    },
    panelBelowSpacer: {
        flex: '6 0 auto',
    },
};

class ModalWrapper extends React.Component {
    constructor(props) {
        super(props);

        this.onKeyUp = this.onKeyUp.bind(this);
    }

    componentDidMount() {
        // this needs to be a listener on the window
        // rather than a listener on the div, because onKeyUp won't fire
        // unless an input is focused
        window.addEventListener('keyup', this.onKeyUp, false);
    }

    componentWillUnmount() {
        window.removeEventListener('keyup', this.onKeyUp, false);
    }

    onKeyUp(e) {
        if (e.keyCode === 27) {
            this.props.dispatch(hideModal());
        }
    }

    render() {
        const handleBackgroundClick = e => {
            if (e.target !== e.currentTarget) return;
            this.props.dispatch(hideModal());
        };

        return (
            <div style={styles.back} onClick={handleBackgroundClick}>
                <div style={styles.panelAboveSpacer}></div>
                <p>Hello</p>

                <div style={styles.panelBelowSpacer}></div>
            </div>

        );
    }
}

const mapStateToProps = (state) => {
    return {
        token: state.auth.token,
        user: state.auth.user
    };
};

export default connect(mapStateToProps)(ModalWrapper);