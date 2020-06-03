const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");
const categoriesController = require("./categories/CategoriesController");
const articlesController = require("./articles/ArticlesController");
const Article = require("./articles/Article");
const Category = require("./categories/Category");
const usersController = require("./users/UsersController");
const User = require("./users/User")
const session = require("express-session");
 
// view engine
app.set('view engine','ejs');

// sessions
app.use(session ({
secret: "qualqercoisa", cookie:{maxAge:30000000}
}));

//static
app.use(express.static('public'));

//body parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//database
connection.authenticate().
then(() =>{
    console.log("Conexao sucesso");
}).catch((error) =>{
    console.log(error);
}) 

// rotas importadas do controller
app.use("/",  categoriesController);
app.use("/", articlesController);
app.use("/", usersController);


app.get("/session", (req,res) =>{
    req.session.treinamento = "Formacao node"
    req.session.ano = 2020
   
    res.send("Sessao gerada");
});

app.get("/leitura" ,(req,res) =>{
res.json({
    treinamento: req.session.treinamento,
    ano: req.session.ano
 })
 
});


// home page mostrando artigos
app.get("/", (req , res) =>{
    Article.findAll({
        order:[
            ['id', 'DESC']
        ],
        limit :4
    }).then(articles => {
        Category.findAll().then(categories =>{
            res.render("index", {articles: articles, categories: categories});
        })
        
    });
});

app.get("/:slug", (req,res) =>{
    var slug = req.params.slug;
    Article.findOne({
        where:{
            slug:slug
        }
    }).then(article =>{
        if(article!= undefined){
            Category.findAll().then(categories =>{
                res.render("article", {article: article, categories: categories});
            })

        }else{ 
            res.redirect("/");
        }
    }).catch(err =>{
        res.redirect("/");
    })
});


app.get("/category/:slug", (req,res) =>{
    var slug = req.params.slug;
    Category.findOne({ // pesquisa pelo slug
        where:{
            slug:slug
        }, 
        include: [{model: Article}]
    }).then( category =>{ // se achou entao testa
        if(category != undefined){ // se for diferente de indefinido
            Category.findAll().then(categories =>{ // busca todas e joga na variavel categories
                res.render("index", {articles: category.articles, categories: categories})
            });

        }else{
            res.redirect("/");     // sendo nulo redireciona      
        }
    }).catch(err =>{ // se der erro redireciona
        res.redirect("/");
    })
});




app.listen(8080,() =>{ // porta onde roda o app
    console.log("o servidor está rodando!");

}) 


