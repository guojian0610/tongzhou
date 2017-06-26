let express = require('express');
let router = express.Router();

//import Header from '../app/components/Header.jsx'

router.use((req, res, next)=>{
    console.log('Entering Main Router');
    next();
})

router.get('/home', (req, res, next)=>{
    console.log('Entering home');
    // res.send('Here is home');
    //var reactHtml = React.renderToString(<Header name='James'/>);
    // ReactApp输出内容输出到index.ejs的变量reactOutput处
    res.render('index',{
        //body: reactHtml,
        //webpackManifest: {"0":"js/0.986a752c8f1b00f3cc35.js","1":"js/1.c8662e9abc6e9bfab2b1.js"}
    });
})

router.get('/myAccount', (req, res, next)=>{
    console.log('Entering myAccount');
    res.send('Here is my account');
})

module.exports = router;