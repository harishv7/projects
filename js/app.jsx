var gitHubUserName = "harishv7";
var gradients = [{
	first: '#56ab2f',
	second: '#a8e063'
}, {
	first: '#E0EAFC',
	second: '#CFDEF3'
}, {
	first: '#C9FFBF',
	second: '#FFAFBD'
}, {
	first: '#00d2ff',
	second: '#3a7bd5'
}, {
	first: '#2BC0E4',
	second: '#EAECC6'
}, {
	first: '#F09819',
	second: '#EDDE5D'
}, {
	first: '#EDE574',
	second: '#E1F5C4'
}, {
	first: '#B3FFAB',
	second: '#12FFF7'
}, {
	first: '#0072ff',
	second: '#00c6ff'
}, {
	first: '#4CB8C4',
	second: '#3CD3AD'
}];

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
	        homepages: []  
	    };
	},
	componentWillMount() {
		var populatedNames = [];
		var populatedDescriptions = [];
		var populatedHomepages = [];
		var populatedImgUrls = [];

		// check if there is a query param for the username
		var currentUrl = window.location.href;
		var username = getParameterByName('name', currentUrl);

		if(username != null && username != "" && username != " ") {
			gitHubUserName = username;
		}

		var apiUrl = "http://harishv.me/portfolio.json";
		this.serverRequest = $.get(apiUrl, function (result) {
			for (var i = 0; i < result.length; i++) { 
				populatedNames.push(result[i].name);
				populatedDescriptions.push(result[i].description);
				populatedImgUrls.push(result[i].imgUrl);
				populatedHomepages.push(result[i].homepage);
			}
			this.setState({
				names: populatedNames,
				description: populatedDescriptions,
				imgUrls: populatedImgUrls,
				homepages: populatedHomepages
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

		var portfolioRowsArr = [];
		var porfolioItemsForOneRow = [];
		for(var i = 0; i < namesOfRepos.length; i++) {
			porfolioItemsForOneRow.push({
				name: namesOfRepos[i],
				desc: descOfRepos[i],
				home: homepagesOfRepos[i],
				imgUrl: imgUrlsOfRepos[i],
				key: i
			});

			if(porfolioItemsForOneRow.length === 3) {
				portfolioRowsArr.push(<PortfolioRow items={porfolioItemsForOneRow} />);
				portfolioRowsArr.push(<hr />);
				porfolioItemsForOneRow = [];
			}
		}

		// push any remaining items
		if(porfolioItemsForOneRow.length > 0) {
			portfolioRowsArr.push(<PortfolioRow items={porfolioItemsForOneRow} />);
			portfolioRowsArr.push(<hr />);
		}	

		return (
			<div>
				{portfolioRowsArr}
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
				{firstItemExists ? <PortfolioItem title={this.props.items[0].name} desc={this.props.items[0].desc} home={this.props.items[0].home} imgUrl={this.props.items[0].imgUrl} /> : null}
				{secondItemExists ? <PortfolioItem title={this.props.items[1].name} desc={this.props.items[1].desc} home={this.props.items[1].home} imgUrl={this.props.items[1].imgUrl} /> : null}
				{thirdItemExists ? <PortfolioItem title={this.props.items[2].name} desc={this.props.items[2].desc} home={this.props.items[2].home} imgUrl={this.props.items[2].imgUrl} /> : null}
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

		// choose a random gradient
		var randomNum = Math.floor(Math.random() * (gradients.length));
		var gradient = gradients[randomNum];
		// craft the css
		var gradientStatement = "linear-gradient(to bottom right," + gradient.first + "," + gradient.second +")";
		// console.log(gradientStatement);
		var gradientStyle = {backgroundImage: gradientStatement};
		// var gradientStyle = "background-image: linear-gradient(to bottom right,#56ab2f,#a8e063);";
		return (
			<div className="col-md-4">
				<img src={this.props.imgUrl} className="img-responsive repoLogo image-center" style={gradientStyle}/> 
                <h2 className="text-center title">{this.props.title}</h2> 
                <p className="description">{this.props.desc}</p>
                {showHome ? <p className="description"><a href={this.props.home} >Homepage</a></p> : null }
			</div>
		);
	}
});

ReactDOM.render(<App />, document.getElementById("app"));