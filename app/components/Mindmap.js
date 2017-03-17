/**
 * Created by Daniel on 12/30/2016.
 */
import React from 'react';
import { connect } from 'react-redux';
import Graph from './Graph';
import { getWalkThrough } from '../actions/modals';
import _ from 'lodash';
import Nodes from './Nodes'

class Mindmap extends React.Component {

    constructor(props) {
        super(props);
        if(this.props.user.isNewUser) {
            this.props.dispatch(getWalkThrough());
        }
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
        this.state = {
            data : data,
        };

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
        return (
        <div style={sideBarStyle} >
            <Nodes />
        </div>);
    }
    render() {

        return (
            <section>
                <div  style = {{ float: 'left'}}>
                    <Graph data = {this.state.data} />
                </div>
                <span className="glyphicon glyphicon-chevron-right" style={{float: 'right'}}></span>
                {/*{this.getChevron()}*/}
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
        activeModal: state.modals.activeModal
    }
};

export default connect(mapStateToProps)(Mindmap);
