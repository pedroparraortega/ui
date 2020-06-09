import _ from 'the-lodash'
import { splitDn } from '../utils/naming-utils'

class StateHandler {
    constructor(state, diagramService) {
        this.sharedState = state;
        this._service = diagramService;
        this._setup();
    }

    close() {

    }

    _setup() {
        this._handleSelectedDnAutoExpandChange()
        this._handleTimeMachineChange()
        this._handleSelectedObjectChange()
        this._handleSelectedObjectAssetsChange()
        this._handleTimelineDataChange()
    }

    _handleSelectedDnAutoExpandChange()
    {
        this.sharedState.subscribe('selected_dn',
            ( selected_dn ) => {
                if (selected_dn) {
                    var dict = this.sharedState.get('diagram_expanded_dns');
                    var parts = splitDn(selected_dn);
                    var dn = parts[0];
                    for(var i = 1; i < parts.length - 1; i++)
                    {
                        dn = dn + '/' + parts[i];
                        dict[dn] = true;
                    }
                    this.sharedState.set('diagram_expanded_dns', dict, { skipCompare: true });
                }
            });
    }

    _handleTimeMachineChange() {
        // TODO: .....
        this.sharedState.subscribe(['time_machine_enabled', 'time_machine_date'],
            ({ time_machine_enabled, time_machine_date }) => {
                if (time_machine_enabled) {
                    this._service.fetchHistorySnapshot(time_machine_date, (sourceData) => {

                        if (this.sharedState.get('time_machine_enabled') &&
                            (this.sharedState.get('time_machine_date') == time_machine_date ))
                        {
                            this.sharedState.set('diagram_data', sourceData);
                        }
                    })
                }
            })
    }

    _handleSelectedObjectChange() {

        this.sharedState.subscribe(['selected_dn', 'time_machine_enabled', 'time_machine_date'],
            ({ selected_dn, time_machine_enabled, time_machine_date }) => {

                if (selected_dn) {
                    if (time_machine_enabled) {
                        this._service.fetchHistoryProperties(selected_dn, time_machine_date, (config) => {
                            this.sharedState.set('selected_object_assets', config);
                        })
                    }
                } else {
                    this.sharedState.set('selected_object_assets', null);
                }
            });

    }

    _handleSelectedObjectAssetsChange() {
        this.sharedState.subscribe('selected_object_assets',
            (selected_object_assets) => {
                console.log('selected_object_assets', selected_object_assets)
                if (selected_object_assets) {
                    this.sharedState.set('selected_object_props', selected_object_assets.props);
                    this.sharedState.set('selected_object_alerts', selected_object_assets.alerts);
                } else {
                    this.sharedState.set('selected_object_props', []);
                    this.sharedState.set('selected_object_alerts', []);
                }
            })
    }

    _handleTimelineDataChange() {
        this.sharedState.subscribe(['time_machine_date_from', 'time_machine_date_to'],
            ({ time_machine_date_from, time_machine_date_to }) => {

                if (!time_machine_date_from || !time_machine_date_to) {
                    this.sharedState.set('time_machine_timeline_data', null);
                    this.sharedState.set('time_machine_actual_date_from', null);
                    this.sharedState.set('time_machine_actual_date_to', null);

                    return;
                }

                var from = time_machine_date_from.toISOString();
                var to = time_machine_date_to.toISOString();

                this._service.fetchHistoryTimeline(from, to, data => {
                    for(var x of data)
                    {
                        x.date = new Date(x.date);
                    }
                    var orderedData = _.orderBy(data, ['date'], ['asc']);
                    this.sharedState.set('time_machine_timeline_data', orderedData);

                    this.sharedState.set('time_machine_actual_date_from', time_machine_date_from);
                    this.sharedState.set('time_machine_actual_date_to', time_machine_date_to);

                });

            }
        )
    }

}

export default StateHandler;