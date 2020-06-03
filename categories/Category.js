const Sequelize = require("Sequelize");
const connection = require("../database/database");

const Category = connection.define('categories', {// cria a tabela categories no banco
    title: { // campo title
        type:Sequelize.STRING,
         allowNull: false
    }, 
    slug: { // campo slug
        type: Sequelize.STRING,
        allowNull:false
    }
});
 
//Category.sync({force:true}); // linha removidapara nao criar a tabela novamente
 
module.exports = Category; // exportando o model