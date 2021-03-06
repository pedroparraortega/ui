import _ from 'the-lodash'

import { GRAPH_DATA } from '../boot/diagramMockData'

class MockWebSocketService
{
    constructor(state)
    {
        this.sharedState = state;
        this._readGraphData();
    }

    close()
    {
      
    }

    _readGraphData()
    {
        this._nodeData = {};
        this._nodeChildren = {};

        var traverse = (parentDn, node) => {
            var dn;
            if (parentDn) {
                dn = parentDn + '/' + node.rn;
            } else {
                dn = node.rn;
            }

            var graphNode = {
                dn: dn,
                rn: node.rn,
                kind: node.kind,
                name: node.name,
                order: node.order,
                alertCount: node.alertCount,
                flags: _.keys(node.flags),
                markers: node.markers,
                childrenCount: 0
            };

            this._nodeData[dn] = graphNode;
            this._nodeChildren[dn] = [];

            if (node.children) {
                graphNode.childrenCount = node.children.length;
                for(var childNode of node.children)
                {
                    var childNode = traverse(dn, childNode);
                    for(var severity of _.keys(childNode.alertCount))
                    {
                        if (graphNode.alertCount[severity]) {
                            graphNode.alertCount[severity] += childNode.alertCount[severity];
                        } else {
                            graphNode.alertCount[severity] = childNode.alertCount[severity];
                        }
                    }

                    this._nodeChildren[dn].push(childNode.dn);
                }
            }
            return graphNode;
        };
        traverse(null, GRAPH_DATA);

        console.log("NODE DATA", this._nodeData);
        console.log("NODE CHILDREN DATA", this._nodeChildren);
    }

    scope(cb)
    {
        return {
            replace: (subscriptions) => {
                this._handleSubscriptions(subscriptions, cb);
            }
        }
    }

    _handleSubscriptions(subscriptions, cb)
    {
        for(var x of subscriptions)
        {
            var item = this._getItem(x);
            if (item) {
                cb(item.value, item.target);
            }
        }
    }

    _getItem(subscription)
    {
        if(subscription.kind == 'node')
        {
            var value = this._nodeData[subscription.dn];
            if (!value) {
                return;
            }

            return {
                target: { dn: subscription.dn},
                value: value
            }
        }
        else if(subscription.kind == 'children')
        {
            var value = this._nodeChildren[subscription.dn];
            if (!value) {
                return;
            }

            return {
                target: { dn: subscription.dn},
                value: value
            }
        }
    }
}

export default MockWebSocketService;
