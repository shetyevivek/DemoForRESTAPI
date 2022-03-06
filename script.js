const express = require('express'); //Import Express
const Joi = require('joi'); //Import Joi
const app = express(); //Create Express Application on the app variable
app.use(express.json()); //Used the json file

//Give data to the server
const customers = [
    {title: 'George', id: 1},
    {title: 'Josh', id: 2},
    {title: 'Tyler', id: 3},
    {title: 'Alice', id: 4},
    {title: 'Candice', id: 5},
]

//Read Request Handlers
//Display the Message when the URL consist of '/'
app.get('/', (req,res) => {
    res.send('Welcome to Edureka REST API');
});

//Display the list of Customers when URL consists of API customers
app.get('/api/customers', (req,res) => {
    res.send(customers);
});

//Display the info of specific customer when you give id
app.get('/api/customers/:id', (req,res) => {
    const customer = customers.find(c => c.id === parseInt(req.params.id));
    //If not found --> error message
    if(!customer) res.status(404).send('<h1>Not found!</h1>');
    res.send(customer);
});

//CREATE REQUEST HANDLER
//CREATE NEW CX INFO
app.post('/api/customers', (req,res) => {

    const{ error } = validateCustomer(req.body);
    if (error) {
        res.status(400).send(error.details[0].message)
        return;
    }
    //Increment the customer id
    const customer = {
        id: customers.length + 1,
        title: req.body.title
    };
    customers.push(customer);
    res.send(customer);
});

//Update Request Handler
//Update existing customer info
app.put('/api/customers/:id', (req,res) => {
    const customer = customers.find(c => c.id === parseInt(req.params.id));
    //If not found --> error message
    if(!customer) res.status(404).send('<h1>Not found!</h1>');

    const { error } = validateCustomer(req.body);
    if (error) {
        res.send(400).send(error.details[0].message);
        return;
    }

    customer.title = req.body.title;
    res.send(customer);
});

//Delete Request Handler
//Delete Customer Details
app.delete('/api/customers/:id', (req,res) => {
    const customer = customers.find(c => c.id === parseInt(req.params.id));
    //If not found --> error message
    if(!customer) res.status(404).send('<h1>Not found!</h1>');

    const index = customers.indexOf(customer);
    customers.splice(index,1);

    res.send(customer);
});

// Validate Info
function validateCustomer(customer) {
    const schema = Joi.object({
        title: Joi.string().min(3).required()
    });
    //return Joi.validate(customer, schema);
    return schema.validate(customer);
}

//PORT ENVIRONMENT VARIABLE
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}..`));
