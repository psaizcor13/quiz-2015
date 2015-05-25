// MW de autorización de accesos HTTP restringidos
exports.loginRequired = function(req, res, next){
     if (req.session.user) {
        next();
     } else {
        res.redirect('/login');
     }
};


// Get /login -- Formulario de login
exports.new = function(req, res) {
	var errors = req.session.errors || {};
	req.session.errors = {};

	res.render('sessions/new', {errors: errors});
};

// POST /login -- Crear la sesion si usuario se autentica
exports.create = function(req, res) {

	var login = req.body.login;
	var password = req.body.password;
	var tiempo = Date.now();
	console.log("Tiempo al guardar:" + tiempo + "\n");

	var userController = require('./user_controller');
	userController.autenticar(login, password, function(error, user) {

 if (error) { // si hay error retornamos mensajes de error de sesión
 	req.session.errors = [{"message": 'Se ha producido un error: '+error}];
 	res.redirect("/login");
 	return;
 }

 // Crear req.session.user y guardar campos id, username y tiempo
 // La sesión se define por la existencia de: req.session.user
req.session.user = {id:user.id, username:user.username, isAdmin:user.isAdmin, tiempo:tiempo};

 res.redirect(req.session.redir.toString());// redirección a path anterior a login
});
};

// Auto-logout de la sesion cuando se han cumplido 2 minutos
exports.autologout = function(req, res, next){
	console.log("Entro en autologout   \n\n");
   if(req.session.user){
	var tiempoActual = Date.now();

	var tiempoInicial = req.session.user.tiempo;
		console.log("Antes de log   \n\n");
		console.log("Tiempo:" + tiempoInicial + "\n");
		console.log("Tiempo:" + tiempoActual + "\n");

	var transcurrido = tiempoActual - tiempoInicial;
	console.log("Tiempo transcurrido:" + transcurrido + "\n");

	if(transcurrido/1000 < 120){  //??¿ ira a destroy o al sigyuiente MW de index?¿?
		req.session.user.tiempo = tiempoActual;
		console.log("log OK   \n\n");
		next();

	} else {
		console.log("Su sesión ha expirado   \n\n");
		 res.redirect('/logout',{});
         }
    }else{
	next();
    }

};

// DELETE /logout -- Destruir sesion
exports.destroy = function(req, res) {
	delete req.session.user;
 res.redirect(req.session.redir.toString()); // redirect a path anterior a login
}; 
