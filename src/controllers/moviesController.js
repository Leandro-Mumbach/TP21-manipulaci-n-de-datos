const db = require('../database/models');
const sequelize = db.sequelize;
const moment = require('moment')

//Otra forma de llamar a los modelos
const Movies = db.Movie;
const Genres = db.Genre;
//const Actors = db.Actor;

const moviesController = {
    'list': (req, res) => {
        db.Movie.findAll()
            .then(movies => {
                res.render('moviesList.ejs', {movies})
            })
    },
    'detail': (req, res) => {
        db.Movie.findByPk(req.params.id)
            .then(movie => {
                res.render('moviesDetail.ejs', {movie});
            });
    },
    'new': (req, res) => {
        db.Movie.findAll({
            order : [
                ['release_date', 'DESC']
            ],
            limit: 5
        })
            .then(movies => {
                res.render('newestMovies', {movies});
            });
    },
    'recomended': (req, res) => {
        db.Movie.findAll({
            where: {
                rating: {[db.Sequelize.Op.gte] : 8}
            },
            order: [
                ['rating', 'DESC']
            ]
        })
            .then(movies => {
                res.render('recommendedMovies.ejs', {movies});
            });
    }, //Aqui debemos modificar y completar lo necesario para trabajar con el CRUD
    add: function (req, res) {
        db.Genre.findAll({
            order: ['name']
        })
        .then(genres => res.render('moviesAdd', {genres}))
        .catch(err => console.log(err))
    },
    create: function (req, res) {
        const {title, release_date, awards, length, rating, genre_id } = req.body
        db.Movie.create({
            title : title.trim(),
            rating,
            length,
            awards,
            release_date,
            genre_id})
        .then(movie => {console.log(movie)
            return res.redirect('/movies')})
        .catch(err => console.log(err))
        
    },
    edit: function(req, res) {
        let Movie = Movies.findByPk(req.params.id)
        let genres = Genres.findAll({
            order : ['name']})
        Promise.all([Movie, genres])
            .then(([Movie, genres]) => { 
                /* console.log(Movie)
                console.log(genres) */
                return res.render('moviesEdit', {
                    Movie, genres, moment})})
            .catch(error => console.log(error))
    },
    update: function (req,res) {
        const {title, release_date, awards, length, rating, genre_id } = req.body
        Movies.update({
            title : title.trim(),
            rating,
            length,
            awards,
            release_date,
            genre_id
        },{
            where: {id: req.params.id}
        })
        .then(() => res.redirect('/movies/detail/' + req.params.id))
        .catch(error => console.log(error))
    },
    delete: function (req, res) {
        // TODO
    },
    destroy: function (req, res) {
        // TODO
    }

}

module.exports = moviesController;