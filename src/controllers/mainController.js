const path = require('path')
const fs = require('fs');
const db = require('../database/models');

const productsFilePath = path.join(__dirname, '../data/products.json');
const charactersFilePath = path.join(__dirname, '../data/characters.json')
const listaPeliculas = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
const listaPersonajes = JSON.parse(fs.readFileSync(charactersFilePath, 'utf-8'));

const masBuscadas = listaPeliculas.filter(function(product){
	return product.categoria == "mas-buscadas";
});

const recomendadas = listaPeliculas.filter(function(product){
	return product.categoria == "recomendadas";
});

const mainController = {
    home: (req,res)=>{
        //res.render('home', {masBuscadas, recomendadas, listaPersonajes, user: req.session.userLogged})
        db.Movie.findAll({
            include: [{association: "genres"},{association: "languages"}]
        })
            .then(movies => res.render('home', {masBuscadas, recomendadas, listaPersonajes, user: req.session.userLogged, movies}));
    },
    login: (req,res)=>{
        res.render('login')
    },
    register: (req,res)=>{
        res.render('register')
    },
    carrito: (req,res)=>{

        let id = req.params.id || 4 
        let anterior = id-1 || listaPeliculas.length
        let siguiente = listaPeliculas.length>=( parseInt(id)+1) ? ( parseInt(id)+1) : 1
        
        db.Movie.findAll({include: [ {association:'users_cart'} ] } ) 
        .then(results => {
            let cartList = []
            
            results.forEach(pelicula => {
                if (pelicula.users_cart.length > 0) {
                    pelicula.users_cart.forEach(element => {
                        element.id == req.session.userLogged.id ? cartList.push(pelicula) : null
                    });
                }
            });
            //res.json(cartList)
            res.render('carrito', {listaPeliculas, id, anterior, siguiente, user: req.session.userLogged, cartList})
        })
    },
    carrito2: (req,res)=>{
        res.render('carrito2')
    },
}

module.exports = mainController