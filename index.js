const http = require('http');
const path = require('path');
const fs = require('fs');

/*
const corsOptions = {
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    preflightContinue: true,
    maxAge: 600,
  };
app.options('*', cors(corsOptions));
app.use(cors(corsOptions));
*/

const server = http.createServer((req, res) => {
    // Build fie path
    let filePath = path.join(__dirname, 'public', req.url === '/' ? 'web.html' : req.url);
    console.log(filePath);

    // Extension of file
    let extname = path.extname(filePath);

    //Initial content type
    let conetentType = 'text/html';
    switch (extname){
        case '.js':
            conetentType = 'text/javascript';
            break;
        case '.css':
            conetentType = 'text/css';
            break;
        case '.json':
            conetentType = 'application/json';
            break;
        case '.png':
            conetentType = "image/png";
            break;
        case '.jpg':
            conetentType = 'image/jpg';
            break;
    }

    // read file
    fs.readFile(filePath, (err, content) => {
        if(err){throw err}
        else{
            res.writeHead(200, {'Content-Type': conetentType});
            res.end(content, 'utf8');
        }
    });

});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log('Server running on port ${PORT}'));

