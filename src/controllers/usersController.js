const path = require('path')
const fs = require('fs');
const bcrypt = require('bcryptjs')
//const User = require('../../models/User');
const User = require('../database/models/User');
const { validationResult } = require('express-validator');
const db = require('../database/models');

const usersFilePath = path.join(__dirname, '../data/users.json');
const listaUsers = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));

const controller = {
/*    perfil:(req,res)=>{
        let id = req.params.id
        res.render('users/perfilUser',{listaUsers, id, user: req.session.userLogged})
    }*/
	perfil: (req, res) => {
		db.User.findByPk(3,{include: [{association: "genres"}]})
			.then(user => res.render('users/perfilUser',{user, user: req.session.userLogged}))

	},
    editarPerfil:(req,res)=>{
        res.render('users/editarPerfilUser',{listaUsers, user: req.session.userLogged})
    },
    
    processRegister: (req, res) => {
		const resultValidation = validationResult(req);

		if (resultValidation.errors.length > 0) {
			return res.render('register', {
				errors: resultValidation.mapped(),
				oldData: req.body
			});
		}

		db.User.findAll({
			where:{"email":req.body.email}
		})
			.then(userInDB => {

				if (userInDB.length > 0) { 
				res.render('register', {
						errors: {
							email: {
								msg: 'Este email ya está registrado'
							}
						},
						oldData: req.body
					});	
				
				} else {
					db.User.create({
						name: req.body.name,
						username:req.body.usuario,
						email:req.body.email,
						password: bcrypt.hashSync(req.body.password, 10),
						image_url: req.file ? req.file.filename : '/userFoto.jpeg',
						is_admin:0,
						id_favorite_genre:1,
						is_active:1
					})
						.then(res.redirect('/login'));
				}
			})
	},
   
    loginProcess: (req, res) => {
		//let userToLogin = db.User.findByField('email', req.body.email);	
		db.User.findAll({
			where:{"email":req.body.email}
		})
			//.then(userToLogin => console.log(userToLogin));
			.then(userToLogin => {
				let isOkThePassword = userToLogin.length > 0 ? bcrypt.compareSync(req.body.password, userToLogin[0].password) : null;
				if (isOkThePassword) {
					delete userToLogin.password;
					req.session.userLogged = userToLogin;
	
					if(req.body.remember_user) {
						res.cookie('userEmail', req.body.email, { maxAge: (1000 * 60) * 60 * 24 * 10}) //dura 10 dias
					}
	
					return res.redirect('/users/perfil/');
				} else if(!isOkThePassword && userToLogin.length > 0  && userToLogin[0].email == req.body.email) {
					return res.render('login', {
						errors: {
							email: {
								msg: 'Las credenciales son inválidas '
							}
						},
						oldData: req.body
					})
				} else {
					res.render('login', {
						errors: {
							email: {
								msg: 'No se encuentra este email en nuestra base de datos'
							}
						},
						oldData: req.body
					});
				}		
			})		
	},
    logout: (req, res) => {
		res.clearCookie('userEmail');
		req.session.destroy();
		return res.redirect('/');
	},
	deseos:(req,res)=>{
		User.agregarToDeseos(28,  4)
		res.redirect('/products/listadoDeseos')
	},
	listaUsuarios:(req,res)=>{
		db.User.findAll()
			.then(users => res.render('users/listaUsuarios',{users,user: req.session.userLogged}));
		
	},

	editarUsuario:(req,res)=>{
		if(req.session.userLogged.category == "admin") { 
			db.User.findByPk(req.params.id,{include: [{association: "genres"}]})
				.then(userToEdit => res.render('users/editarPerfilAdmin',{user:req.session.userLogged, userToEdit}));
		} else {
			res.redirect('/');
		}
	},

	guardarUsuario:(req,res)=> {

		db.User.findByPk(req.params.id,{include: [{association: "genres"}]})
			.then(userToEdit => userToEdit = {
				"id": userToEdit.id,
				"name": userToEdit.name,
				"username": userToEdit.username,
				"email": userToEdit.email,
				password: bcrypt.hashSync(req.body.password, 10),
				"image": userToEdit.image,
				"is_admin": userToEdit.is_admin
			})

		db.User.update(
			{
				"id": req.body.id,
				"name": req.body.name,
				"username": req.body.username,
				"email": req.body.email,
				password: bcrypt.hashSync(req.body.password, 10),
				"image": req.body.image,
				"is_admin": req.body.is_admin
			},
			{
				where: {id: req.params.id}
			})
			.then(res.redirect('/'));
	},

	confirmarBorrado: (req,res)=> {
		if(req.session.userLogged.category == "admin") { 
			let userToDelete = listaUsers.find(user => user.id == req.params.id);
			res.render('users/eliminarUsuario',{user:req.session.userLogged, userToDelete});
		} else {
			res.redirect('/');
		}
	},

	borrarUsuario: (req,res)=> {
		if(req.session.userLogged.category == "admin") { 
			let userDelete = listaUsers.filter(user => user.id != req.params.id);
			fs.writeFileSync(usersFilePath, JSON.stringify(userDelete,null, '\t'));
			res.redirect('/');
		} else {
			res.redirect('/');
		}
	} 

}

module.exports = controller