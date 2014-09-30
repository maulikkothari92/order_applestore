var express    = require('express');   
var app        = express();            
var bodyParser = require('body-parser');
var iPhone_order      = require('./iPhone_order');

app.use(bodyParser());

var port = process.env.PORT || 8080;       

var router = express.Router();

router.post('/order', function(req, res) {
    iPhone_order.start_spooky(req.body, function(response){
    	res.send(response);
  });
});

app.use('/', router);

app.listen(port);
