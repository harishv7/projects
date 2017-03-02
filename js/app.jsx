function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

var App = React.createClass({
	getInitialState() {
	    return {
	        names: [],
	        description: [],
	        portfolioRows: [],
	        imgUrls: [],
	        homepages: [],
	        tags: []
	    };
	},
	componentWillMount() {
		var populatedNames = [];
		var populatedDescriptions = [];
		var populatedHomepages = [];
		var populatedImgUrls = [];
		var populatedTags = [];

		var apiUrl = "http://harishv.me/portfolio.json";
		this.serverRequest = $.get(apiUrl, function (result) {
			for (var i = 0; i < result.length; i++) { 
				populatedNames.push(result[i].name);
				populatedDescriptions.push(result[i].description);
				populatedImgUrls.push(result[i].imgUrl);
				populatedHomepages.push(result[i].homepage);
				populatedHomepages.push(result[i].tag);
			}
			this.setState({
				names: populatedNames,
				description: populatedDescriptions,
				imgUrls: populatedImgUrls,
				homepages: populatedHomepages,
				tags: populatedTags
			});
		}.bind(this));
	},
	componentWillUnmount() {
	    this.serverRequest.abort();  
	},
	render: function() {
		// create all the rows we need and populate into an array
		var namesOfRepos = this.state.names;
		var descOfRepos = this.state.description;
		var homepagesOfRepos = this.state.homepages;
		var imgUrlsOfRepos = this.state.imgUrls;
		var tagsOfItems = this.state.tags;

		var portfolioRowsArr = [];
		var porfolioItemsForOneRow = [];
		var photoItemsArr = [];
		var photoItemsForOneRow = [];

		for(var i = 0; i < namesOfRepos.length; i++) {
			if(tagsOfItems[i] == 'photo') {
				porfolioItemsForOneRow.push({
					name: namesOfRepos[i],
					desc: descOfRepos[i],
					home: homepagesOfRepos[i],
					imgUrl: imgUrlsOfRepos[i],
					tag: tagsOfItems[i],
					key: i
				});
			} else {
					porfolioItemsForOneRow.push({
					name: namesOfRepos[i],
					desc: descOfRepos[i],
					home: homepagesOfRepos[i],
					imgUrl: imgUrlsOfRepos[i],
					tag: tagsOfItems[i],
					key: i
				});
			}
			

			if(porfolioItemsForOneRow.length === 3) {
				portfolioRowsArr.push(<PortfolioRow items={porfolioItemsForOneRow} />);
				portfolioRowsArr.push(<hr />);
				porfolioItemsForOneRow = [];
			}

			if(photoItemsForOneRow.length === 3) {
				photoItemsArr.push(<PortfolioRow items={photoItemsForOneRow} />);
				photoItemsArr.push(<hr />);
				photoItemsForOneRow = [];
			}
		}

		// push any remaining items
		if(porfolioItemsForOneRow.length > 0) {
			portfolioRowsArr.push(<PortfolioRow items={porfolioItemsForOneRow} />);
			portfolioRowsArr.push(<hr />);
		}
		if(photoItemsForOneRow.length > 0) {
			photoItemsArr.push(<PortfolioRow items={photoItemsForOneRow} />);
			photoItemsArr.push(<hr />);
		}

		return (
			<div>
				<h1>Projects</h1>
				{portfolioRowsArr}
				<h1>Photography</h1>
				{photoItemsArr}
			</div>
		);
	}
});

var PortfolioRow = React.createClass({
	render: function() {
		var firstItemExists = true, secondItemExists = true, thirdItemExists = true;
		// check if the 3 items exist
		if(typeof this.props.items[0] == 'undefined') {
			firstItemExists = false;
			secondItemExists = false;
			thirdItemExists = false;
		} else if (typeof this.props.items[1] == 'undefined') {
			secondItemExists = false;
			thirdItemExists = false;
		} else if (typeof this.props.items[2] == 'undefined') {
			thirdItemExists = false;
		}
		return (
			<div className="row"> 
				{firstItemExists ? <PortfolioItem tag={this.props.items[0].tag} title={this.props.items[0].name} desc={this.props.items[0].desc} home={this.props.items[0].home} imgUrl={this.props.items[0].imgUrl} /> : null}
				{secondItemExists ? <PortfolioItem tag={this.props.items[1].tag} title={this.props.items[1].name} desc={this.props.items[1].desc} home={this.props.items[1].home} imgUrl={this.props.items[1].imgUrl} /> : null}
				{thirdItemExists ? <PortfolioItem tag={this.props.items[2].tag} title={this.props.items[2].name} desc={this.props.items[2].desc} home={this.props.items[2].home} imgUrl={this.props.items[2].imgUrl} /> : null}
        	</div>
		);
	}
});

var PortfolioItem = React.createClass({
	render: function() {
		var showHome = true;
		// check if homepage exists
		if(this.props.home === null || this.props.home === "" || this.props.home === " ") {
			showHome = false;
		}

		return (
			<div className="col-md-4">
				<img src={this.props.imgUrl} className="img-responsive repoLogo image-center"/> 
                <h2 className="text-center title">{this.props.title}</h2> 
                <p className="description">{this.props.desc}</p>
                {showHome ? <p className="description"><a href={this.props.home} >Homepage</a></p> : null }
			</div>
		);
	}
});

ReactDOM.render(<App />, document.getElementById("app"));