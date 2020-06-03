const express = require('express');
const router = express.Router();
const Category = require("./Category");
const slugify = require("slugify");

router.get("/admin/categories/new", (req,res) =>{
res.render("admin/categories/new");

});

router.post("/categories/save", (req,res) =>{ // rota definida para salvar a categoria, o form vai enviar os dados para cá
 var title = req.body.title;  // variavel que recebe a o titulo pelo req
    if(title!= undefined){ // verifica se nao é nulo
        Category.create({ // salva no banco
            title:title,
            slug: slugify(title)
        }).then(()=> { 
            res.redirect("/admin/categories"); // depois de salvo redireciona 
        })

    }else{
        res.redirect("/admin/categories/new"); // caso seja nulo redireciona para a pagina new
    }
});

router.get("/admin/categories", (req,res) => { // rota para categoria
    Category.findAll().then(categories =>{ // busca todas categorias, coloca na variavel categories
        res.render("admin/categories/index", {categories:categories}); // manda via json as categorias para a view
    });

});

router.post("/categories/delete", (req,res) =>{
    var id = req.body.id;
    if(id != undefined){ 

        if(!isNaN(id)){ // passou por todas verificacoes
            Category.destroy({
                where:{
                    id:id
                }
            }).then(() => {
                res.redirect("/admin/categories");
            });

        }else{ // se nao for um numero
            res.redirect("/admin/categories");
        }

    }else{ // se for nulo
        res.redirect("/admin/categories");
    }

});

router.get("/admin/categories/edit/:id" , (req,res) =>{ // rota para editar
    var id = req.params.id; // variavel recebe o id

        if(isNaN(id)){
            res.redirect("/admin/categories");
        }

    Category.findByPk(id).then(categoria =>{ // metodo que busca um id especifico
        if(categoria != undefined){ // se nao for nulo
            res.render("admin/categories/edit",{categoria:categoria}) //  renderiza a view e passa a categoria encontrada para a tela

        }else{
            res.redirect("/admin/categories"); // sendo nulo redireciona para categorias
        }

    }).catch(erro =>{
        res.redirect("/admin/categories"); // nao encontrando o id redireciona para categorias
    })

});

router.post("/categories/update", (req,res)=>{ // recebe via formulario
    var id = req.body.id; // variavel que pega o id do form
    var title = req.body.title; // variavel que pega o titulo do form
    Category.update({title:title, slug:slugify(title)},{ // atualiza o dado especificado
        where:{
            id:id // onde id seja igual a id recebido
        }
    }).then(() =>{
        res.redirect("/admin/categories"); // redireciona
    })
})



module.exports = router; // exporta o modulo
