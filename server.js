var express = require('express');
var mongoose = require('mongoose');
var app = express ();

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


var usuario = mongoose.Schema({
  fecha: String,
  usuario: String,
  tipo_emergencia: String,
  ubicacion: { longitude: String, latitude: String, accuracy: String }
});
var usuariosEmergenciasModel = mongoose.model('Usuarios_Emergencias',usuariosEmergenciasSchema);




var exports = module.exports = {};



// make express look in the public directory for assets (css/js/img)
app.use(express.static(__dirname + '/public'));
var html_dir = './public/';
app.get('/', function (req, res) {
  res.render('login');
})
// set the home page route
app.get('/index', function(req, res) {

    // ejs render automatically looks in the views folder
    res.render('index');
})

app.get('/emergencias', function(req, res) {

    // ejs render automatically looks in the views folder
    res.render('emergencias');
})

app.post('/usuarioMobil', function (req, res) {
  console.log('Este es el nombre de usuario: ' + req.query.usuario);
  console.log('Este es el tipo de emergencia: ' + req.query.tipo_emergencia);
  console.log('Esta es la ubicacion: ' + req.query.ubicacion);

  var fecha = Date.now();
  var usuario = req.query.usuario;
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
  console.log('Esta es la contraseña : ' + req.query.contraseña);
  console.log('acepto terminos: ' + req.query.terminos);


  var nombre = req.query.nombre;
  var usuario = req.query.identificacion;
  var correo = req.query.correo;
  var contraseña = req.query.contraseña;
  var terminos = req.query.terminos;



  var datosAInsertar = new usuariosEmergenciasModel({
	  fecha: fecha,
      usuario: usuario,
	  tipo_emergencia: tipo_emergencia,
	  ubicacion: ubicacion
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
