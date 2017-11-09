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

var exports = module.exports = {};

app.get('/', function (req, res) {
  res.send('Hola Mundo')
})

// make express look in the public directory for assets (css/js/img)
app.use(express.static(__dirname + '/public'));
var html_dir = './public/';

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
