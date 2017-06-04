let express = require('express');
let router = express.Router();

router.use((req, res, next)=>{
    console.log('Entering Main Router');
    next();
})

router.get('/home', (req, res, next)=>{
    console.log('Entering home');
    res.send('Here is home');
})

router.get('/myAccount', (req, res, next)=>{
    console.log('Entering myAccount');
    res.send('Here is my account');
})

module.exports = router;