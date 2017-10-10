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

		// var apiUrl = "https://harishv.me/projects/projects.json";
		var apiUrl = "./projects.json";
		this.serverRequest = $.get(apiUrl, function (result) {
			for (var i = 0; i < result.length; i++) { 
				populatedNames.push(result[i].name);
				populatedDescriptions.push(result[i].description);
				populatedImgUrls.push(result[i].imgUrls);
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
			portfolioRowsArr.push(<PortfolioItem name={namesOfProjects[i]} desc={descOfProjects[i]} homeUrl={homepagesOfProjects[i]} imgUrls={imgUrlsOfProjects[i]} tags={tagsOfProjects[i]} key={i} id={i} />);
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
			tagsToShow.push(<span className="project-tag">{tags[i]}</span>);
		}
		var id = "#" + this.props.id;
		var idName = "" + this.props.id;

		var imagesToShow = [];
		var carouselIndicators = [];
		var images = this.props.imgUrls;

		var moreThanOneImage = false;
		var final = [];
		if(images.length === 1) {
			final.push(<img src={images[0]} className="project-logo img-responsive" />)
		} else {
			moreThanOneImage = true;
			for(var i = 0; i < images.length; i++) {
				if(i == 0) {
					carouselIndicators.push(<li data-target={id} data-slide-to={i} className="active"></li>)

					imagesToShow.push(
						<div className="item active">
							<img src={images[i]} className="project-logo img-responsive" />
						</div>
					);
				} else {
					carouselIndicators.push(<li data-target={id} data-slide-to={i}></li>)

					imagesToShow.push(
						<div className="item">
							<img src={images[i]} className="project-logo img-responsive" />
						</div>
					);
				}
			}

			final.push(
				<div id={idName} className="carousel slide" data-ride="carousel">

						<ol className="carousel-indicators">
							{carouselIndicators}
						</ol>

						<div className="carousel-inner">
							{imagesToShow}
						</div>

						<a className="left carousel-control" href={id} data-slide="prev">
							<span className="glyphicon glyphicon-chevron-left"></span>
							<span className="sr-only">Previous</span>
						</a>
						<a className="right carousel-control" href={id} data-slide="next">
							<span className="glyphicon glyphicon-chevron-right"></span>
							<span className="sr-only">Next</span>
						</a>
					</div>
			);
		}

		return (
			<div className="section">
		      <div className="container">
		        <div className="row">
		          <div className="col-md-6">
				  {final}
		          </div>
		          <div className="col-md-6">
		            <h1 className="project-heading">{this.props.name}</h1>
		            <p className="project-desc">{this.props.desc}</p>
		            <a href={this.props.homeUrl} className="project-url">{this.props.homeUrl}</a>
		            <br/> <br/>
		            {tagsToShow}
		          </div>
		        </div>
		      </div>
		    </div>
		);
	}
});

ReactDOM.render(<App />, document.getElementById("app"));