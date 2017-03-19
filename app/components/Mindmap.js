/**
 * Created by Daniel on 12/30/2016.
 */
import React from 'react';
import { connect } from 'react-redux';
import Graph from './Graph';
import { getWalkThrough } from '../actions/modals';
import { toggleSideBar } from '../actions/viewPortActions';
import _ from 'lodash';
import Nodes from './Nodes';

class Mindmap extends React.Component {

    constructor(props) {
        super(props);
        if (this.props.user.isNewUser) {
            this.props.dispatch(getWalkThrough());
        }
        this.getGraphData = this.getGraphData.bind(this);
    }
    componentWillMount() {
        console.log("Fell in here");
        this.props.dispatch(toggleSideBar(false));
    }
    getGraphData() {
        var data;
        if(this.props.user.mindmapOption === 'sprawl') {
            data = {
                "name": this.props.user.name,
                "img": this.props.user.picture || this.props.user.gravatar,
                "children": []
            };
            if (this.props.user.nodes.length > 0) {
                var nodeData = getOptionOneData(this.props.user.nodes);
                data.children = nodeData;
            }
        }
        else if(this.props.user.mindmapOption === 'tiered') {
            data = [{
                "name": this.props.user.name,
                "img": this.props.user.picture || this.props.user.gravatar,
            }];
            if(this.props.user.nodes.length > 0) {
                var nodeData = getOptionTwoData(this.props.user.nodes);
                data = _.concat(data, nodeData);
            }
        }
        return data;

        function getOptionOneData(nodes) {
            var nodeData = null;
            nodes.forEach(function (node) {
                var singleNodeData = {
                    "name": node.name,
                    "children" : []
                };
                if (node.nodes && node.nodes.length > 0) {
                    var subNodes = getOptionOneData(node.nodes);
                    singleNodeData.children = _.concat(singleNodeData.children, subNodes);
                }
                if(nodeData === null) {
                    nodeData = [singleNodeData];
                }
                else {
                    nodeData = _.concat(nodeData, singleNodeData);
                }
            });
            return nodeData;
        }
        function getOptionTwoData(nodes) {
            var nodeData = null;
            nodes.forEach(function (node) {
                var singleNodeData = {
                    'name': node.name,
                    'target': [0]
                };
                if (node.nodes && node.nodes.length > 0) {
                    singleNodeData = {
                        'name': node.name,
                        'target': [0],
                        'subDocs': [{'name': node.name}]
                    };
                    var subNodes = getOptionTwoData(node.nodes);
                    singleNodeData.subDocs = _.concat(singleNodeData, subNodes);
                }
                if(nodeData === null) {
                    nodeData = singleNodeData;
                }
                else {
                    nodeData = _.concat(nodeData, singleNodeData);
                }
            });
            return nodeData;
        }
    }

    getSideBar() {
        var sideBarStyle = {
            width: this.props.width * 0.25,
            float: 'right',
            paddingRight: 20,
        };
        if(this.props.sideBar) {
            return (
                <div style={sideBarStyle}>
                    <Nodes />
                </div>);
        }
        else
            return null;
    }

    toggleSideBar(onOff) {
        this.props.dispatch(toggleSideBar(onOff));
        setTimeout(function(){ window.dispatchEvent(new Event('resize')); }, 10);

    }

    getChevron() {
        if(this.props.sideBar) {
            return <span className="glyphicon glyphicon-chevron-right" onClick={() => this.toggleSideBar(false)} style={{float: 'right'}}></span>;
        }
        else
            return <span className="glyphicon glyphicon-chevron-left" onClick={() => this.toggleSideBar(true)} style={{float: 'right'}}></span>;
    }

    render() {

        return (
            <section>
                <div  style = {{ float: 'left'}}>
                    <Graph data = {this.getGraphData()} getGraphData = {this.getGraphData}/>
                </div>
                {this.getChevron()}
                {this.getSideBar()}
            </section>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.auth.user,
        width: state.viewPort.width,
        height: state.viewPort.height,
        activeModal: state.modals.activeModal,
        sideBar : state.viewPort.sideBar,
    }
};

export default connect(mapStateToProps)(Mindmap);
