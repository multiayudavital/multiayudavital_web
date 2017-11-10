var express = require('express');
var mongoose = require('mongoose');
var session = require('express-session');
var bodyParser = require('body-parser');
var bluebird = require('bluebird');

var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = 'd6F3Efeq';

var app = express ();

// use bluebird as default promise library
mongoose.Promise = bluebird;

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
    var sessData = req.session;
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

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.post('/registrarUsuario', function (req, res) {
  console.log('Este es el nombre de usuario: ' + req.body.nombre);
  console.log('Este es la identificacion: ' + req.body.identificacion);
  console.log('Este es el correo : ' + req.body.correo);
  console.log('Esta es la contrasena : ' + req.body.contrasena);
  console.log('acepto terminos: ' + req.body.terminos);


  var nombre = req.body.nombre;
  var usuario = req.body.identificacion;
  var correo = req.body.correo;
  var contrasena = req.body.contrasena;
  var terminos = req.body.terminos;


  var datosAInsertar = new usuarioModel({
      nombre: nombre,
      usuario: usuario,
      correo: correo,
      terminos: terminos,
      contrasena : encrypt(contrasena)
  });

    var error = ";"

    datosAInsertar.save(function (err) {
        if (err) {
            error = {"error":"Usuario no existe"};
        }else{
            error = {"msg":"exito"};
        }
    });

    res.send(error);

})

app.get('/usuarioWeb', function (req, res) {
    usuariosEmergenciasModel.find(function (err, records) {
        res.send(records);
    });
})

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.post('/loguearse', function (req, res) {

        var correo = req.body.correo;
        var contrasena = encrypt(req.body.contrasena);

        console.log(correo);
        console.log(contrasena);

        if(correo && contrasena){
            var callback = function (err, usuario) {
                if (err || usuario == null) {
                    res.send({"error":"Usuario no existe"});
                    return;
                };

                if(usuario.nombre){
                    console.log('%s !!!!!!.', usuario.nombre)

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


function encrypt(text){
    var cipher = crypto.createCipher(algorithm,password)
    var crypted = cipher.update(text,'utf8','hex')
    crypted += cipher.final('hex');
    return crypted;
}

function decrypt(text){
    var decipher = crypto.createDecipher(algorithm,password)
    var dec = decipher.update(text,'hex','utf8')
    dec += decipher.final('utf8');
    return dec;
}