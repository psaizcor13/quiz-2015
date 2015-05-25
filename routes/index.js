var express = require('express');
var multer  = require('multer');
var router = express.Router();


var quizController = require('../controllers/quiz_controller');
var commentController = require('../controllers/comment_controller');
var sessionController = require('../controllers/session_controller');
var statisticsController = require('../controllers/statistics_controller');
var userController = require('../controllers/user_controller');



/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz', errors: []});

});

router.get('/author', function(req, res) {
  res.render('author', { title: 'Quiz', errors: []});
});

// Autoload de comandos con ids
router.param('quizId', quizController.load);  // autoload :quizId
router.param('commentId', commentController.load); // autoload :commentId
router.param('userId', userController.load); // autoload :userId


// Definición de rutas de sesion
router.get('/login', sessionController.new); // formulario login
router.post('/login', sessionController.create); // crear sesión
router.get('/logout', sessionController.destroy); // destruir sesión

// Definición de rutas de cuenta
router.get('/user',  userController.new);     // formulario sign un
router.post('/user',  userController.create);     // registrar usuario
router.get('/user/:userId(\\d+)/edit',  sessionController.loginRequired, userController.ownershipRequired, userController.edit);     // editar información de cuenta
router.put('/user/:userId(\\d+)',  sessionController.loginRequired, userController.ownershipRequired, userController.update);     // actualizar información de cuenta
router.delete('/user/:userId(\\d+)',  sessionController.loginRequired, userController.ownershipRequired, userController.destroy);     // borrar cuenta
router.get('/user/:userId(\\d+)/quizes',  quizController.index);     // ver las preguntas de un usuario


// Definición de rutas de /quizes
router.get('/quizes',                     sessionController.autologout, quizController.index);
router.get('/quizes/:quizId(\\d+)',        sessionController.autologout, quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', sessionController.autologout, quizController.answer);
router.get('/quizes/new', sessionController.loginRequired, sessionController.autologout, quizController.new);
router.post('/quizes/create', sessionController.loginRequired, multer({ dest: './public/media/'}) ,sessionController.autologout, quizController.create);
router.get('/quizes/:quizId(\\d+)/edit', sessionController.loginRequired, quizController.ownershipRequired,sessionController.autologout ,quizController.edit);
router.put('/quizes/:quizId(\\d+)', sessionController.loginRequired,quizController.ownershipRequired,multer({ dest: './public/media/'}),sessionController.autologout  ,quizController.update);
router.delete('/quizes/:quizId(\\d+)', sessionController.loginRequired,quizController.ownershipRequired,sessionController.autologout ,quizController.destroy);

// Definición de rutas de comentarios
router.get('/quizes/:quizId(\\d+)/comments/new', sessionController.autologout, commentController.new);
router.post('/quizes/:quizId(\\d+)/comments', sessionController.autologout, commentController.create);
router.get('/quizes/:quizId(\\d+)/comments/:commentId(\\d+)/publish',
 		sessionController.loginRequired, sessionController.autologout,commentController.ownershipRequired ,commentController.publish);

// Definición de rutas de estadísticas
router.get('/quizes/statistics', statisticsController.statistics );

module.exports = router;
