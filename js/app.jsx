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

		var apiUrl = "http://harishv.me/projects/projects.json";
		this.serverRequest = $.get(apiUrl, function (result) {
			for (var i = 0; i < result.length; i++) { 
				populatedNames.push(result[i].name);
				populatedDescriptions.push(result[i].description);
				populatedImgUrls.push(result[i].imgUrl);
				populatedHomepages.push(result[i].homepage);
				populatedTags.push(result[i].tags);
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
		var namesOfProjects = this.state.names;
		var descOfProjects = this.state.description;
		var homepagesOfProjects = this.state.homepages;
		var imgUrlsOfProjects = this.state.imgUrls;
		var tagsOfProjects = this.state.tags;

		var portfolioRowsArr = [];

		for(var i = 0; i < namesOfProjects.length; i++) {
			portfolioRowsArr.push(<PortfolioItem name={namesOfProjects[i]} desc={descOfProjects[i]} homeUrl={homepagesOfProjects[i]} imgUrl={imgUrlsOfProjects[i]} tags={tagsOfProjects[i]} key={i} />);
			portfolioRowsArr.push(<hr/>)
		}

		return (
			<div>
				{portfolioRowsArr}
			</div>
		);
	}
});

var PortfolioItem = React.createClass({
	render: function() {
		var tags = this.props.tags;
		var tagsToShow = [];
		for(var i = 0; i < tags.length; i++) {
			tagsToShow.push(<span class="tags">tags[i]</span>);
		}
		return (
			<div className="section">
		      <div className="container">
		        <div className="row">
		          <div className="col-md-6">
		            <img src={this.props.imgUrl} className="project-logo img-responsive" />
		          </div>
		          <div className="col-md-6">
		            <h1 className="project-heading">{this.props.name}</h1>
		            <p className="project-desc">{this.props.desc}</p>
		            {tagsToShow}
		          </div>
		        </div>
		      </div>
		    </div>
		);
	}
});

ReactDOM.render(<App />, document.getElementById("app"));