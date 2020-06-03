const express = require('express');
const router = express.Router();
const Category = require("../categories/Category");
const Article = require("./Article");
const slugify = require("slugify");
const adminAuth = require("../middlewares/adminAuth");

router.get("/admin/articles",adminAuth, (req,res) =>{
    Article.findAll({
        include:[{model: Category}] // inclui a categoria, join table
    }).then(articles =>{
        res.render("admin/articles/index", {articles: articles});
        
    });
    
});
//novo
router.get("/admin/articles/new", (req,res) =>{ // novo artigo
    Category.findAll().then(categories =>{ // busca todas categorias
        res.render("admin/articles/new", {categories:categories}) // envia a categoria para a view
    })
    
});
// salvar
router.post("/articles/save", (req,res) =>{ 
    var title = req.body.title;
    var body = req.body.body;
    var category = req.body.category;
    
    if(title!= undefined){
        Article.create({ // salvando no banco
            title: title,
            slug: slugify(title),
            body: body,
            categoryId: category // chave estrangeira
        }).then(() =>{
            res.redirect("/admin/articles");
        });
    }else{
        console.log("nao salvou")
        res.redirect("/admin/articles/new");
    }
  
});

// deletar
router.post("/articles/delete", (req,res) =>{
    var id = req.body.id;
    if(id != undefined){ 

        if(!isNaN(id)){ // passou por todas verificacoes
            Article.destroy({
                where:{
                    id:id
                }
            }).then(() => {
                res.redirect("/admin/articles");
            });

        }else{ // se nao for um numero
            res.redirect("/admin/article");
        }

    }else{ // se for nulo
        res.redirect("/admin/article");
    }

});


router.get("/admin/articles/edit/:id" , (req,res) =>{ // rota para editar
    var id = req.params.id; // variavel recebe o id

        if(isNaN(id)){
            res.redirect("admin/articles");
        }

    Article.findByPk(id).then(article =>{ // metodo que busca um id especifico
        if(article != undefined){ // se nao for nulo
            Category.findAll().then(categories => {
                res.render("admin/articles/edit",{categories:categories, article:article}) //  renderiza a view e passa a categoria encontrada para a tela
            });
            
           

        }else{
            res.redirect("/"); // sendo nulo redireciona para categorias
        }

    }).catch(erro =>{
        res.redirect("/"); // nao encontrando o id redireciona para categorias
    })

});


router.post("/articles/update", (req,res)=>{ // recebe via formulario
    var id = req.body.id; // variavel que pega o id do form
    var title = req.body.title;  // variavel que pega o titulo do form
    var body = req.params.body; // variavel que pega o body do form
    var category = req.body.category; // variavel que pega a categoria
    Article.update({title:title,categoryId:category, body:body,  slug:slugify(title) },{ // atualiza o dado especificado
        where:{
            id:id // onde id seja igual a id recebido
        }
    }).then(() =>{
        res.redirect("/admin/articles"); // redireciona
    }).catch(err => {
        res.redirect("/");
    });
});

router.get("/articles/page/:num", (req,res) =>{ // rota que recebe a paginacao
    var page = req.params.num;
    var offset = 0;
   
    if(isNaN(page) || page ==1){ // se nao for numero o offset reebe 0
        offset=0;
    }else{
        offset = (parseInt(page)-1 )* 4; // se for o offset recebe a pagina * 4 que é o numero de itens por pagina
    }

    Article.findAndCountAll({ // busca todos artigos do BD e conta
        limit: 4, // limite de itens por pagina
        offset: offset, // offset recebe o calculo de offset
        order:[
            ['id', 'DESC']
        ]
    }).then(articles =>{ 

        var next; 
        if(offset + 4 >= articles.count ){ // se offset + 4 for maior que a contagem de itens do BD
            next = false;
                     // next recebe falso
        }else{
            next = true;  // senao recebe true, significando que tem mais paginas a serem exibidaas
        }

        var result = { // variavel que devolve o resultado
            page : parseInt(page),
            next : next,
            articles : articles
        }
        Category.findAll().then(categories =>{
            res.render("admin/articles/page", {result:result, categories:categories}) // essa view recebe o result e as categorias
        });

    })
});


module.exports = router;
