const path = require('path')
const fs = require('fs');

const usersFilePath = path.join(__dirname, '../data/users.json');
const listaUsers = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));

const controller = {
    perfil:(req,res)=>{
        res.render('users/perfilUser',{listaUsers})
    },
    editarPerfil:(req,res)=>{
        res.render('users/editarPerfilUser',{listaUsers})
    },
    guardarRegistro:(req,res)=>{
        let emailRepetido = false
        let salida
        listaUsers.forEach(element => {
           if( element.email == req.body.email ){
            emailRepetido = true
           } 
        });
        let newUser = {
            id: (listaUsers[listaUsers.length-1].id)+1,
            name:req.body.name,
            usuario:req.body.usuario,
            email:req.body.email,
            password:req.body.password,
            image:req.file.filename || '/emiliaclarke.png'
        }
        if(!emailRepetido){
        listaUsers.push(newUser)
        fs.writeFileSync(usersFilePath, JSON.stringify(listaUsers,null, '\t' ))
        salida = 'users/perfilUser'
        }else{  salida = 'register'  }
        
        console.log(newUser)
        res.render(salida ,{old:req.body, listaUsers})
        //console.log(req.file.filename)
    }
}

module.exports = controller