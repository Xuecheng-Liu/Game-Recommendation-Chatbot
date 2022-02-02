# GameBot

## steps to compile GameBot
1. make changes to assistant.js
2. Use **Browserify** to make a distribution js file
    - $ browserify public/assistant.js -s myBundle > public/bundle.js
3. Run the server to run http server
    a. To run the server once, 
        - $ node index.js
    b. To keep running the server after changes
        - $ npm run dev