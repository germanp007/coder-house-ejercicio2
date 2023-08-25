import fs from 'fs';
import crypto from 'crypto';

class CrearUser {
    // para usar el modulo crypto, se crea una contrasena secreta privada
    #secret = "coderhash";
    constructor(path){
        this.path = path
    }
    async addUser(usuario){
        try {
            if(this.existUsers()){
                const usersJson = await fs.promises.readFile(this.path, 'utf-8');
                const usersList = JSON.parse(usersJson);
               // para encriptar el password con el modulo crypto / createHmac / update / digest
               if (!usersList.some(ele => ele.username === usuario.username)){
                usuario.password = crypto.createHmac('sha256', this.#secret).update(usuario.password).digest('hex')
                usersList.push(usuario);
                await fs.promises.writeFile(this.path, JSON.stringify(usersList, null, 2))
                
               }else {
                throw new Error('Usuario existente');
             }
                
             } else {
                throw new Error('No se puede leer el archivo');
             }
        } catch (error) {
            console.log(error)
        }
    }
    existUsers() {
        return fs.existsSync(this.path)
    }
    async validateUser(userInfo){
        try {
            if(this.existUsers()){
                const usersJson = await fs.promises.readFile(this.path, 'utf-8');
                const usersList = JSON.parse(usersJson);
                const userExist = usersList.find(ele => ele.username === userInfo.username)
                if (userExist) {
                    const validation = crypto.createHmac('sha256', this.#secret).update(userInfo.password).digest('hex')
                    if (userExist.password.match(validation)) { //Usamos .match() para validar el user de la DB con el del login
                      console.log('Usuario Logueado')
                    } else {
                        throw new Error('Password Invalido')
                    }
                } else {
                    throw new Error('Usuario Invalido')
                }
             } else {
                throw new Error('Datos Invalidos');
             }
        } catch (error) {
            console.log(error)
        }
    }
    async getUsers(){
        try {
            if(this.existUsers()){
                const usersJson = await fs.promises.readFile(this.path, 'utf-8');
                const usersList = JSON.parse(usersJson);
                return usersList;
             } else {
                throw new Error('No se puede leer el archivo');
             }
        } catch (error) {
            console.log(error)
        }
    }
}

(async ()=> {
    const usuarios = new CrearUser('./dataBase.json');
    
    // await usuarios.addUser({nombre: 'German', apellido: 'Pinto', username: 'germanp007', password: 'ger3355'});
    await usuarios.validateUser({username: 'germanp007', password: 'ger3355'})
    
})()
