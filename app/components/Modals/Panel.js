/**
 * Created by Daniel on 1/24/2017.
 */
import React from 'react';

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
                backgroundColor: '#2196F3',
                color: '#FFFFFF',
                boxShadow: '0 1px 3px ${rgba(0, 0, 0, 0.382)}',
                zIndex: 1,
            },
            title : {
                fontSize : 22,
                paddingLeft: 20,
                whiteSpace: 'nowrap',
                // overflow: 'Hidden',
            },
            close : {
                backgroundColor :'#2196F3',
                border : 'none',
                padding: 20,
                fontSize: 16,
            },
            body : {
                flex: '1 1 auto',
                padding: '24px 24px 0',
                overflow: 'auto'
            },
            panelBody: {
                display : 'flex',
                flexDirection : 'column',
                padding : 0,
            },
            okButton : {
                marginLeft: this.props.width - 100 ,
                backgroundColor : '#2196F3',
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
                        <button className="btn pull-right" style = {styles.close} onClick = {() => {console.log("Close Now")}}>Close</button>
                    </div>
                    <div style = {styles.panelBody}>
                        {this.props.children}
                    </div>
                    <button className = "btn" style = {styles.okButton} >Save</button>
                </div>
            </div>
        );
    }
}

export default Panel;
