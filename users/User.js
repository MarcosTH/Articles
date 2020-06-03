const Sequelize = require("Sequelize");
const connection = require("../database/database");

const User = connection.define('users', {// cria a tabela categories no banco
    email: { // campo title
        type:Sequelize.STRING,
         allowNull: false
    }, 
    password: { // campo slug
        type: Sequelize.STRING,
        allowNull:false
    }
});
 
//User.sync({force:true}); // linha removidapara nao criar a tabela novamente
 
module.exports = User; // exportando o model