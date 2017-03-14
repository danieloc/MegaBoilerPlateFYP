/**
 * Created by Daniel on 1/24/2017.
 */
import React from 'react';
import {hideModal} from '../../actions/modals'

class Panel extends React.Component {

    render() {
        const styles = {
            panelWrapper : {
                display: 'flex',
                flexFlow: 'column',
            },
            panel : {
                flex: '0 0 auto',
                display: 'flex',
                flexFlow : 'column',
                width : this.props.width,
                height : 500,
                maxHeight: '94vh',
                maxWidth: '98vh',
                backgroundColor : '#FFFFFF',
            },
            header : {
                height: 64,
                flex : '0 0 auto',
                display : 'flex',
                flexFlow : 'horizontal',
                justifyContent: 'space-between',
                backgroundColor: this.props.PrimaryColor,
                color: '#FFFFFF',
                boxShadow: '0 1px 3px ${rgba(0, 0, 0, 0.382)}',
                zIndex: 1,
                textAlign: 'center'
            },
            title : {
                fontSize : 22,
                paddingLeft: 20,
                whiteSpace: 'nowrap',
                // overflow: 'Hidden',
            },
            close : {
                backgroundColor :this.props.PrimaryColor,
                border : 'none',
                padding: 20,
                fontSize: 16,
            },
            body : {
                flex: '1 1 auto',
                padding: '24px 24px 0',
                overflow: 'auto',
                textAlign: 'center'
            },
            panelBody: {
                display : 'flex',
                flexDirection : 'column',
            },
            okButton : {
                marginLeft: this.props.width - 100 ,
                backgroundColor : this.props.PrimaryColor,
                color : '#FFFFFF',
                padding: 12,
                width: 20,
                minWidth: 100
            },

        };

        return (
            <div style = {styles.panelWrapper}>
                <div style = {styles.panel}>
                    <div style = {styles.header}>
                        <h1 style = {styles.title}> {this.props.title}</h1>
                        <button className="btn pull-right" style = {styles.close} onClick = {() => {this.props.dispatch(hideModal())}}>Close</button>
                    </div>
                    <div style = {styles.body}>
                        {this.props.children}
                    </div>
                </div>
            </div>
        );
    }
}

export default Panel;
