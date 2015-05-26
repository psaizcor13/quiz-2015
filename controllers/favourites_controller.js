var models = require('../models/models.js');
var quizes = [];

//Nuevo favorito
exports.new = function(req, res, next){
	var quiz = req.quiz;
	var user = req.user;

	user.hasQuiz(quiz).then(function(result){
		if(result){
		  console.log("ya es favorita");
		  next();
		} else {
		    user.addQuiz(quiz).then(function(){
			 user.hasQuiz(quiz).then(function(result){
				console.log("el" +user.id + "hizo favorita a la pregunta" + quiz.id + "con exito");
			 })

	        })
		}
		//console.log(req.session.redir.toString());
		//res.redirect(req.session.redir.toString());
	});
}

//MW para quitar una pregunta de favorita
exports.destroy = function(req, res){
//	console.log("llego a este otro");
	var quiz = req.quiz;
	var user = req.user;
//	console.log("llego a este otro");

	user.hasQuiz(quiz).then(function(result){
//	console.log(result);
	   if(result){
//		console.log("es favorita");
			
		user.removeQuiz(quiz).then(function(){
			//user.hasQuiz(quiz).then(function(result){
			//	console.log(" el" +user.id + " quito de favorita a la pregunta " + quiz.id + " con exito");
			})
	} else {
//		console.log("no es favorita");
	}
	//res.redirect(req.session.redir.toString());
  })
}

exports.index = function(req, res) {  
  var favs = {};
  var index = 0;
  
  models.Quiz.findAll().then(
  function(quizes) {
	for(i in quizes){
	   user.hasQuiz(quizes[i]).then(function(result){
	       favs[index] = result;
	       index++;   
        })
    }
        res.render('quizes/index.ejs', {quizes: favs, errors: []});  
    }).catch(function(error) { next(error)});
}

