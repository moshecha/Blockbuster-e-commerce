import React from "react";

export default class LastMovieInDb extends React.Component {
    constructor(props) {
        super(props);
        this.state = { lastMovieInDb: '' };
    }

    async fetchMovies() {
        const response = await fetch("http://localhost:5000/api/products");
        const result = await response.json();
        this.setState({ lastMovieInDb: result.data[result.data.length-1] });
        console.log(this.state.lastMovieInDb)
    }

    componentDidMount() {
        this.fetchMovies();
    }

    render(props) {
    return (

        <div className="col-lg-6 mb-4">
                    <div className="card shadow mb-4">
                        <div className="card-header py-3">
                            <h5 className="m-0 font-weight-bold text-gray-800">
                                Last movie in Data Base
                            </h5>
                        </div>
                        <div className="card-body">
                        <h2>{this.state.lastMovieInDb.title}</h2>

                            <div className="text-center">
                                <img
                                    className="img-fluid px-3 px-sm-4 mt-3 mb-4"
                                    style={{ maxWidth: 20 + "rem" }}
                                    src={this.state.lastMovieInDb.image_url}
                                    alt=" Star Wars - Mandalorian "
                                />
                            </div>
                            <p>
                                {this.state.lastMovieInDb.description}
                            </p>
                            <a
                                className="btn btn-danger d-none"
                                target="_blank"
                                rel="nofollow"
                                href="/"
                            >
                                View movie detail
                            </a>
                        </div>
                    </div>
                </div>
    )
    
}
}
