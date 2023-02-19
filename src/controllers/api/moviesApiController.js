const path = require("path");
const db = require("../../database/models");
const sequelize = db.sequelize;
const { Op } = require("sequelize");
const moment = require("moment");


const moviesApiController = {
    list: (req, res) => {
        db.Movie.findAll(
            {include: [{association: "genres"},{association: "languages"},{association:'users_rentals'},{association:'users_wishlist'},{association:'users_cart'}]}
        ).then((movies) => {
            let respuesta = {
                meta: {
                    status: 200,
                    total: movies.length,
                    url: "api/products",
                },
                data: movies,
            };
            res.json(respuesta);
        });
    },

    detail: (req, res) => {
        db.Movie.findByPk(req.params.id, 
            {include: [{association: "genres"},{association: "languages"}]}
            ).then((movie) => {
            let respuesta = {
                meta: {
                    status: 200,
                    //total: movie.length,
                    url: "/api/products"+req.params.id,
                },
                data: movie,
            };
            res.json(respuesta);
        });
    },

    create: (req, res) => {
        Movies.create({
            title: req.body.titulo,
            image_url: req.body.imagen || req.file ? '/images/img-movies/'+req.file.filename : "https://i.pinimg.com/564x/f8/28/73/f828738fc037b66f2bdb74deaf36ad3d.jpg", 
            description: req.body.descripcion,
            length: req.body.duracion,
            release_year: req.body.release_year,
            price: req.body.precio,
            trailer: req.body.trailer ||  "https://www.youtube.com/embed/LDXYRzerjzU",
            is_active: req.body.is_active,
            movie_url: "https://www.youtube.com/embed/LDXYRzerjzU",
            blockbuster_rating: req.body.CalificacionBlockbuster,
            imdb_rating: req.body.CalificacionIMDb,
            rotten_tomatoes_rating: req.body.CalificacionRottenTomatoes
        })
            .then((confirm) => {
                confirm.setGenres(req.body.genres)
                confirm.setLanguages(req.body.languages)

                let respuesta;
                if (confirm) {
                    respuesta = {
                        meta: {
                            status: 200,
                            total: confirm.length,
                            url: "api/products/create",
                        },
                        data: confirm,
                    };
                } else {
                    respuesta = {  //verificar que haria en caso de error o q falte algo
                        meta: {
                            status: 200,
                            total: confirm.length,
                            url: "api/products/create",
                        },
                        data: confirm,
                    };
                }
                res.json(respuesta);
            })
            .catch((error) => res.send(error));
    },
    update: (req, res) => {
        let movieId = req.params.id;
        Movies.update(
            {
                title: req.body.titulo,
                image_url: req.body.imagen, 
                description: req.body.descripcion,
                length: req.body.duracion,
                release_year: req.body.release_year,
                price: req.body.precio,
                trailer: req.body.trailer, 
                is_active: req.body.is_active,
                movie_url: "https://www.youtube.com/embed/LDXYRzerjzU",
                blockbuster_rating: req.body.CalificacionBlockbuster,
                imdb_rating: req.body.CalificacionIMDb,
                rotten_tomatoes_rating: req.body.CalificacionRottenTomatoes
            },
            {
                where: { id: movieId },
            }
        )
            .then((confirm) => {
                db.Movie.findByPk(req.body.id)
                    .then(movie=>{
                        movie.setGenres(req.body.genres)
                        movie.setLanguages(req.body.languages)
                    })

                let respuesta;
                if (confirm) {
                    respuesta = {
                        meta: {
                            status: 200,
                            total: confirm.length,
                            url: "api/products/update/"+movieId,
                        },
                        data: confirm,
                    };
                } else {
                    respuesta = {
                        meta: {
                            status: 204,
                            total: confirm.length,
                            url: "api/products/update/"+movieId,
                        },
                        data: confirm,
                    };
                }
                res.json(respuesta);
            })
            .catch((error) => res.send(error));
    },
    destroy: (req, res) => {
        let movieId = req.params.id;
        Movies.destroy({ where: { id: movieId }, force: true }) // force: true es para asegurar que se ejecute la acción
            .then((confirm) => {
                let respuesta;
                if (confirm) {
                    respuesta = {
                        meta: {
                            status: 200,
                            total: confirm.length,
                            url: "api/products/destroy/"+movieId,
                        },
                        data: confirm,
                    };
                } else {
                    respuesta = {
                        meta: {
                            status: 204,
                            total: confirm.length,
                            url: "api/products/destroy/"+movieId,
                        },
                        data: confirm,
                    };
                }
                res.json(respuesta);
            })
            .catch((error) => res.send(error));
    },
}
module.exports = moviesApiController;