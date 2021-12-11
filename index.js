const express = require('express');
const app = express();
const router = express.Router();
const url = require('url');

require('dotenv').config();

// Twilio
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

// SendGRID
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

router.get('/', (req, res) => {
    console.log(req.params);
    res.send(
            "Bienvenidos, nosotros ofrecemos microservicios de envio de SMS y EMAIL"
            );
});

router.get('/sms', (req, res) => {
    
    const requestRespond = url.parse(req.url,true).query;
    let { mensaje, telefono } = requestRespond;

    client.messages.create({
        body: mensaje ? mensaje : "Hola!",
        from: process.env.MY_PHONE_NUMBER,
        to: '+57' + telefono ? telefono : process.env.MY_PHONE_NUMBER
    })
    .then(message => console.log(message.sid))
    .then(res.send("Mensaje enviado"))
    .catch(err => console.log(err));
    
});

router.get('/email', (req, res) => {

    const requestRespond = url.parse(req.url,true).query;
    let { emailDestino, asunto, mensaje } = requestRespond;

    const msg = {
    to: emailDestino ? emailDestino : process.env.MY_EMAIL, // Change to your recipient
    from: process.env.MY_EMAIL, // Change to your verified sender
    subject: asunto ? asunto : '!IMPORTANT TO READ¡',
    text: asunto ? asunto : '!IMPORTANT TO READ¡',
    html: mensaje ? mensaje : '<h1>Soy sensacional</h1>',
    }

    sgMail
    .send(msg)
    .then(() => {
        res.send('Email sent')
    })
    .catch((error) => {
    console.error(error)
    })
});



app.use(router);
app.listen(3000, () => {
    console.log("Estamos en marcha por el puerto 3000");
});
  

  
  
  