let express = require('express');
let app = express();
let mainRouter = require('../routers/mainRouter')
let path = require('path');


app.set('view engine', 'ejs');

// app.use(express.static('public'),{
//     dotfiles: 'deny'
// });

app.use('/static',express.static(path.resolve(__dirname,'../public')));

app.use('/',(req,res,next)=>{
    console.log(`originalUrl = ${req.originalUrl}`);
    next();
});

app.use('/main', mainRouter)
app.use(function(req, res, next) {
  res.status(404).send('Sorry cant find that!'); 
});
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
let server = app.listen(3000, function () {
    let host = server.address().address;
    let port = server.address().port;
    console.log(`Example app listening at host:${host} port:${port}`);
});
