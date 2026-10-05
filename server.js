const express = require('express');
const app = express();
require('dotenv').config();

const mysql = require('mysql');
const axios = require('axios');

app.use(express.json());

const con = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'rn_openrouter'
});

con.connect((error) => {
    if(error) console.log(error);
    console.log('connected to db successfully');
});

app.listen(8000, () => {
    console.log('app is running on port 8000')
});

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

app.get('/chats',(req,res) => {
    con.query('SELECT * FROM chats',(error,rows) => {
        if(error) {
            console.log(error);
            return res.status(500).json(error);
        }
        return res.json(rows);
    })
});

app.post('/chat', async(req,res) => {
    const {userId, message} = req.body;
    try {
        const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
            model:'openrouter/free',
            messages:[{role:'user', content:message}]
        },
        {
            headers:{
                'Authorization':`Bearer ${OPENROUTER_API_KEY}`,
                'Content-Type':'application/json',
            }
        }
    );

    const reply = response.data.choices[0].message.content;

    const sql = "INSERT INTO chats(user_id, message, reply) VALUES(?, ?, ?)"
    1
    con.query(sql, [userId, message, reply]);

    res.json({reply});

    } catch (error) {
        console.log("Error", error?.response.data || error.content);
        res.json(500).json({error:'server error'})
    }
});