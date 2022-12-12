const path = require('path')
const fs = require('fs');

const productsFilePath = path.join(__dirname, '../data/products.json');
const listaPeliculas = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));


// Atencion que todas las rutas de este controller empiezan con /products


const productsController = {
    misAlquileres: (req,res)=>{
        let id = req.query.id || 4
        res.render('misAlquileres', {listaPeliculas, id})
    },
    productDetail: (req,res)=>{
        let id = req.query.id || 4
        let anterior = id-1 || listaPeliculas.length
        let siguiente = listaPeliculas.length>=( parseInt(id)+1) ? ( parseInt(id)+1) : 1
        res.render('productDetail', {listaPeliculas, id, anterior, siguiente})
    },
    administrarProductos: (req,res)=>{
        let palabraBuscada = req.query.filtrar || ''
        let peliculasFiltradas = []
        for(let i = 0 ;  i< listaPeliculas.length ;i++){
            if(listaPeliculas[i].titulo.toLowerCase().includes(palabraBuscada.toLowerCase())){
                peliculasFiltradas.push(listaPeliculas[i])
            }
        }
        res.render('administrarProductos', {listaPeliculas, peliculasFiltradas})
    },
    listadoDeseos: (req,res)=>{
        res.render('listadoDeseos', {listaPeliculas})
    },
    buscarProductos: (req,res)=>{
        let palabraBuscada = req.query.filtrar || ''
        let peliculasFiltradas = []
        for(let i = 0 ;  i< listaPeliculas.length ;i++){
            if(listaPeliculas[i].titulo.toLowerCase().includes(palabraBuscada.toLowerCase())){
                peliculasFiltradas.push(listaPeliculas[i])
            }
        }
        res.render('buscarProductos', {listaPeliculas, peliculasFiltradas,palabraBuscada})
    },
    editarProducto:(req,res)=>{
        let idProducto = req.query.id 

        // console.log(idProducto, 'editarproducto')
        res.render('editarProducto',{idProducto, listaPeliculas})
    },

    guardarProductoEditado:(req,res)=>{
        // let idProducto = req.query.id
        let newPelicula = {
            id: req.body.id || 1,
            titulo:req.body.titulo,
            imagen:req.body.imagen,
            descripcion:req.body.descripcion,
            genero:req.body.genero || '',
            idioma:req.body.idioma || '',
            duracion:req.body.duracion,
            precio:req.body.precio,
            trailer:req.body.trailer,
            categoria:req.body.categoria || '',
            CalificacionBlockbuster:req.body.CalificacionBlockbuster,
            CalificacionIMDb:req.body.CalificacionIMDb,
            CalificacionRottenTomatoes:req.body.CalificacionRottenTomatoes,
        }
        
        // console.log(newPelicula, idProducto)
        let newlistaPeliculas = listaPeliculas.map(element => {
			if(newPelicula.id == element.id){return element = newPelicula}
			return element
		})

        fs.writeFileSync(productsFilePath, JSON.stringify(newlistaPeliculas,null, '\t' ))
        
        res.redirect('/products/administrarProductos')
    },

    crearNuevoProducto:(req,res)=>{
        let idProducto = req.query.id
        res.render('crearNuevoProducto', {idProducto})
    },

    guardarNuevoProducto:(req,res)=>{
        
        let newPelicula = {
            id: listaPeliculas[listaPeliculas.length-1].id+1,
            titulo:req.body.titulo || '',
            imagen:req.body.imagen || "/images/MaquinasMortales.jpg",
            descripcion:req.body.descripcion,
            genero:req.body.genero || '',
            idioma:req.body.idioma || '',
            duracion:req.body.duracion,
            precio:req.body.precio,
            trailer:req.body.trailer || "https://www.youtube.com/embed/zDABDg7vwsk",
            categoria:req.body.categoria || '',
            CalificacionBlockbuster:req.body.CalificacionBlockbuster,
            CalificacionIMDb:req.body.CalificacionIMDb,
            CalificacionRottenTomatoes:req.body.CalificacionRottenTomatoes,
        }
        listaPeliculas.push(newPelicula)
        fs.writeFileSync(productsFilePath, JSON.stringify(listaPeliculas,null, '\t' ))

        res.redirect('/products/administrarProductos')
    },

    eliminarProducto:(req,res)=>{
        let idProducto = req.params.id
        let newProducts =[]

		listaPeliculas.forEach(element => {
			if(idProducto != element.id){newProducts.push(element)}
		});
		fs.writeFileSync(productsFilePath, JSON.stringify(newProducts,null, '\t'))


        res.redirect('/products/administrarProductos')
    },
    video:(req,res)=>{
        let idProducto = req.params.id || 1
        res.render('video', {listaPeliculas, idProducto})
    },
    
}

module.exports = productsController