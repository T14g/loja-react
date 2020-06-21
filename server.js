const  express =  require('express');
const  cors =  require('cors');
const  bodyParser =  require('body-parser');
const  path =  require('path');

//If you on dev or test ENV
if(process.env.NODE_ENV !== 'production') require('dotenv').config();

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

//Express allows to create API Server easily
const app = express();

//When you deploy to Heroku it sets up the process Port for you!
const port = process.env.PORT || 5000;

//All requested coming in have it body converted to json!
app.use(bodyParser.json());

//Clean urls ex: spaces,symbols
app.use(bodyParser.urlencoded({extended: true}));

//CORS, cross origin request, from client origin to server origin
//Enable cors
app.use(cors());

//IF in production
if(process.env.NODE_ENV === 'production'){
    
    //Allows to serve all static files in this dirname, permite o uso
    app.use(express.static(path.join(__dirname, 'client/build')));

    //If user hit any url you send a static file
    app.get('*', (req,rest)=>{
        rest.sendFile(path.join(__dirname,'client/build', 'index.html'));
    });
}



app.listen(port, error =>{
    if(error) throw error;
    console.log('Running server on port ' + port);
});

// Building routes in express 
app.post('/payment', (req,res) => {
    const body = {
        source: req.body.token.id,
        amount: req.body.amount,
        currency: 'usd'
    };

    stripe.charges.create(body, (stripeErr, stripeRes) => {
        if(stripeErr){
            res.status(500).send({error: stripeErr});
        }else{
            res.status(200).send({ success: stripeRes})
        }
    })
});