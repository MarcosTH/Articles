const Sequelize = require("Sequelize");
const connection = require("../database/database");
const Category = require("../categories/Category")

const Article = connection.define('articles', {// cria a tabela categories no banco
    title: { // campo title
        type:Sequelize.STRING,
         allowNull: false
    }, 
    slug: { // campo slug
        type: Sequelize.STRING,
        allowNull:false
    },
    body:{
        type:Sequelize.TEXT,
        allowNull:false
    }
});

Category.hasMany(Article); // uma categoria tem muitos artigos
Article.belongsTo(Category); // um artigo pertence a uma categoria

//Article.sync({force:true}); // linha removida para nao criar tabela novamente

module.exports = Article; // exportando o model