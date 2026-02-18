const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const FILE_PATH = './records.json';

// Route to save data
app.post('/save', (req, res) => {
    const data = req.body;
    
    fs.writeFile(FILE_PATH, JSON.stringify(data, null, 2), (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error writing file');
        }
        res.send({ message: 'Data saved successfully to hard drive!' });
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});