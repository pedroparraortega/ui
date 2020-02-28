const historyScope = {
	historyClient: null,
    historyView: null,
    data: []
};

class HistoryClient {

	constructor()
	{
		this._dateFrom = moment().subtract(1, 'days').toISOString();
		this._dateTo = null;
		this._selectedDate = null;
		
		this.refresh();
	}

	refresh()
	{
		fetchHistoryRange(data => {

		});

		fetchHistoryTimeline(this._dateFrom, this._dateTo, data => {
			for(var x of data)
			{
				x.date = new Date(x.date);
			}
			historyScope.data = _.orderBy(data, ['date'], ['asc']);
			if (historyScope.historyView) {
				historyScope.historyView.render();
			}
		});
	}

	selectDate(date)
	{
		console.log("[HistoryClient::selectDate] " + date.toISOString());
		this._selectedDate = date;

		if (this._dateChangeTimerId) {
			clearTimeout(this._dateChangeTimerId);
		}

		this._dateChangeTimerId = setTimeout(() => {
			this._loadSnapshot();
		}, 100);
	}

	toggleTimeMachine()
	{

	}

	zoomIn()
	{

	}

	zoomOut()
	{

	}

	panLeft()
	{

	}

	panRight()
	{

	}

	resetView()
	{

	}

	_loadSnapshot()
	{
		console.log("[HistoryClient::_loadSnapshot] " + this._selectedDate);
		this._dateChangeTimerId = null;
	}

}


historyScope.client = new HistoryClient();
