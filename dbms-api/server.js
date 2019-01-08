const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const knex = require('knex')({
  client: 'mysql',
  connection: {
    host : '127.0.0.1',
    user : 'root',
    password : '',
    database : 'payroll'
  }
});

// knex.select('*').from('employee').then(data => {
// 	console.log(data);
// });

const app = express()
app.use(bodyParser.json())
app.use(cors())



// app.get('/',(req,res) => {
// 	res.send("This is good!");
// 	.catch(err => res.json("sorry"))
// })

// app.post('/signin', (req,res) => {
	


// })

app.post('/Register',(req,res) => {
	const { eid, post, name, did} = req.body;
	(knex.select('*').from('employee').where('eid','=',req.body.eid).then( data =>{
		const basic = data[0].basic;
		console.log(basic);
		knex.select('*').from('additional').where('did','=',req.body.did).then( data =>{
			 const med= data[0].medical;
			 const hra = data[0].hra;
			 const da = data[0].da;
			 knex.select('*').from('services').then(data => {
			 const  bus = data[0].bus;
			 const sec = data[0].security;
			 const hos = data[0].hostel;
			 	knex.select('*').from('leaves').where('did','=',req.body.did).then(data =>{
			 		const leaves = data[0].no;
			 		console.log(leaves);
			 		const payroll = basic + (basic*(med*0.01)) + (basic*(hra*0.01)) + (basic*(da*0.01)) - (basic*(bus*0.01)) - (basic*(sec*0.01)) - (basic*(hos*0.01)) -(basic*(leaves*0.01*1));
			 		res.json(payroll);
			 	})
			})
		
	})
		
})
)
	.catch(err => res.json('unable to get user'))
})

app.post('/Useradd',(req,res) => {
	const { eid, post, name, basic, did, didname} = req.body;
	knex('employee')
		.insert({
		eid: eid,
		post: post,
		name: name,
		basic: basic
	}).then(console.log("success"))
		.catch(err => res.json('unable to get user'))
	knex('department').insert({
		name: didname,
		did: did
	}).catch(err => res.json('unable to get user'))
	knex('leaves').insert({
		eid: eid,
		did: did,
		no: 5
	}).catch(err => res.json('unable to get user'))
})

app.listen(3000, () => {
	console.log("app is running!!");
})