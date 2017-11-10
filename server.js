var express = require('express');
var mongoose = require('mongoose');
var session = require('express-session');
var bodyParser = require('body-parser')
var app = express ();

app.use(session({secret: 'ssshhhhh'}));

var db = mongoose.connect("mongodb://multiayudavital_web_app1:multiayudavital1@ds111535.mlab.com:11535/multiayudavital",
  {useMongoClient: true,}
);
db.on('error', console.error.bind(console, 'connection error:'));

var usuariosEmergenciasSchema = mongoose.Schema({
  fecha: String,
  usuario: String,
  tipo_emergencia: String,
  ubicacion: { longitude: String, latitude: String, accuracy: String }
});

var usuariosEmergenciasModel = mongoose.model('Usuarios_Emergencias',usuariosEmergenciasSchema);

var usuarioSchema = mongoose.Schema({
    nombre: String,
    correo: String,
    terminos: String,
    contrasena : String
});
var usuarioModel = mongoose.model('usuarios',usuarioSchema);

var exports = module.exports = {};

// make express look in the public directory for assets (css/js/img)
app.use(express.static(__dirname + '/public'));
var html_dir = './public/';


app.get('/', function (req, res) {
    res.sendfile(html_dir + 'login.html');
})

// set the home page route
app.get('/index', function(req, res) {

    // ejs render automatically looks in the views folder
    res.render('login');
})

app.get('/emergencias', function(req, res) {

    // ejs render automatically looks in the views folder
    res.render('emergencias');
})

app.get('/usuarioMobil', function(req, res) {

    res.sendfile(html_dir + 'usuarioMobil.html');
})

app.post('/usuarioMobil', function (req, res) {
  //console.log('Este es el nombre de usuario: ' + req.query.usuario);
  console.log('Este es el tipo de emergencia: ' + req.query.tipo_emergencia);
  console.log('Esta es la ubicacion: ' + req.query.ubicacion);

  var fecha = new Date().toISOString().
  replace(/T/, ' ').      // replace T with a space
  replace(/\..+/, '');
  var usuario = sessData.usuario.nombre;
  var tipo_emergencia = req.query.tipo_emergencia;
  var ubicacion = req.query.ubicacion;

  if(ubicacion!='undefined' && ubicacion!=null){
      ubicacion = JSON.parse(ubicacion);
  }else {
      ubicacion = null;
  }

  var datosAInsertar = new usuariosEmergenciasModel({
	  fecha: fecha,
      usuario: usuario,
	  tipo_emergencia: tipo_emergencia,
	  ubicacion: ubicacion
  });
  datosAInsertar.save();
    res.sendfile(html_dir + 'exito.html');

})

app.post('/registroUsuario', function (req, res) {
  console.log('Este es el nombre de usuario: ' + req.query.nombre);
  console.log('Este es la identificacion: ' + req.query.identificacion);
  console.log('Este es el correo : ' + req.query.correo);
  console.log('Esta es la contrasena : ' + req.query.contrasena);
  console.log('acepto terminos: ' + req.query.terminos);


  var nombre = req.query.nombre;
  var usuario = req.query.identificacion;
  var correo = req.query.correo;
  var contrasena = req.query.contrasena;
  var terminos = req.query.terminos;



  var datosAInsertar = new usuarioModel({
      nombre: nombre,
      usuario: usuario,
      correo: correo,
      terminos: terminos,
      contrasena : contrasena
  });

  datosAInsertar.save();
    res.sendfile(html_dir + 'exito.html');

})

app.get('/usuarioWeb', function (req, res) {
    usuariosEmergenciasModel.find(function (err, records) {
        if (err) {
            return console.error(err);
        }
        res.send(records);
    });
})

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.post('/loguearse', function (req, res) {

        var correo = req.body.correo;
        var contrasena = req.body.contrasena;

        console.log(correo);
        console.log(contrasena);

        if(correo && contrasena){
            var callback = function (err, usuario) {
                if (err) return handleError(err);
                console.log('%s !!!!!!.', usuario.nombre)

                if(usuario.nombre){
                    req.session.usuario = usuario;
                    var sessData = req.session;
                    sessData.usuario = usuario;

                    res.send(usuario);

                    console.log('Nombre!!!!!'+sessData.usuario.nombre);
                }else{
                    res.send({"error":"Usuario no existe"});
                }

            };

            usuarioModel.findOne({ 'correo': correo, 'contrasena': contrasena}, callback);
        }else{
            res.sendfile(html_dir + 'login.html');
        }


})

app.get('/otro', function (req, res) {
    console.log('Nombre!!!!!'+req.session.usuario.nombre);
})

app.get('/logout', function (req, res) {
    var sessData = req.session;
    sessData.usuario = null;
})


var port = process.env.PORT || 3000;

var server = app.listen(port, function () {
  console.log(`Example app listening on ${port}!`);
})

exports.closeServer = function(){
  server.close();
  db.disconnect();
  console.log('bye');
};
//JUAN PABLO es mi compai
