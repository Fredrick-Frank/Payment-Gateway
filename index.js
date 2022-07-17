const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { strip } = require('colors');

const PUBLISHEDABLE_KEY = "pk_test_51KdcyrJXeDXD8UVP5VOUKe2t23m0MEZiMSgCG4uem9rEiQHZC6kto1yT5ByHAKHKuDpNhNuWzwslJMLew0p9zCYH00JJIQIvyQ"
const SECRET_KEY = "sk_test_51KdcyrJXeDXD8UVPw20vlsV8TQn9mVN1v4R8YPRN1rd8SB24wzsxJijeVRCNCdvOccwPOQIJw0NDuGuOq4pOADJS00T9RsnOwQ"
const stripe = require('stripe')(SECRET_KEY)

//initializing the app into the express
const app = express()

//implementing the body-parser
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json());

//calling in the ejs 
app.set("view engine","ejs");

//setting the PORT address
const PORT = process.env.PORT || 3000

//the get router
app.get('/', (req, res) => {
    res.render('Home', {
        key: PUBLISHEDABLE_KEY
    });
});

//the post router
app.post('/payment', (req, res) => {
    stripe.customers.create({
        email:req.body.stripeEmail,
        source:req.body.stripeToken,
        name:'Fredrick Frank',
        address: {
            line1:'11 Lagos Street',
            postal_code:'110092',
            city:'Lagos',
            state:'Lagos',
            country:'Nigeria'
        }
    })
    .then((customer) => {
        return stripe.charges.create({
            amount:5000,
            description:'Financial Investment',
            currency:'USD',
            customer:customer.id
        })
    })
    .then((charge) => {
        console.log(charge)
        res.send("Success")
    })
    .catch((err) => {
        res.send(err)
    })
});

app.listen(3000, () => console.log('Server Started on port 3000'));
