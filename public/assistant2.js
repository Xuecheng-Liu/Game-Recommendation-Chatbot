const AssistantV2 = require('ibm-watson/assistant/v2');
const { IamAuthenticator } = require('ibm-watson/auth');

let api_key = 'mQm5M8FKoDrr6kHa2egihXw9Y7p1XvyoEEjPdRKoyd1f'; //Bowen's
let url = 'https://api.us-south.assistant.watson.cloud.ibm.com/instances/8332649b-5341-4b1d-acd7-d09c5dca8c97'; //Bowen's
let assistant_id = '62dfbaa1-b17c-4bfa-8693-5c3be0e12d19'; //Bowen's

/*
let api_key = 'PMDpVBUyLC7XpKV-N9hUSmvaY6cWUkEKlXtd3apcOCxh';
let url = 'https://api.us-south.assistant.watson.cloud.ibm.com/instances/b730816f-f905-4b51-94bc-e0b83114e73d';
let assistant_id = 'ffa3c0ac-2506-402f-a3c5-a3ee89c9eb10';
*/

let session_id = "";
let bot_msg = "";
let next_question = "";

const assistant = new AssistantV2({
    version: '2019-02-28',
    authenticator: new IamAuthenticator({
        apikey: api_key,
    }),
    url: url,
});

function createWatsonAssistantSession(){
    const session = assistant.createSession({
        assistantId: assistant_id
    });
    session.then(res => {
        console.log(JSON.stringify(res.result, null, 2)); // for checking JSON response from Watson
        session_id = res.result.session_id.toString();
        //console.log("Session created!, session id: " + session_id);
    
        let input_message = "hello";
        console.log("Input message: " + input_message);
    
        messege = sendWatsonAssistantMessage(input_message);
        console.log("Initial message: " + messege);
        setTimeout(function(){bot_msg = messege;}, 1500);  
        
    }); // end of create session
}

function sendWatsonAssistantMessage(input_message){
    const message =assistant.message({
        assistantId: assistant_id,
        sessionId: session_id,
        input: {
            'message_type': 'text',
            'text': input_message
        }
    });
    message.then(res => {
        console.log(JSON.stringify(res.result, null, 2)); // for checking JSON response from Watson
        let generic = res.result.output.generic // array of responses
        var i;
        let response = '';
        for(i = 0; i<generic.length; i++){
            response = response.concat(generic[i].text.toString() + '\n');
        } 
        console.log("Watson Assistant response: " + response);
        next_question = response;
    });
}

function deleteWatsonAssistnatSession(){
    assistant.deleteSession({
        assistantId: assistant_id,
        sessionId: session_id,
    })
        .then(res => {
            console.log("Session deleted!");
            window.location.href = 'web.html';
        })
        .catch(err => {
            console.log(err);
        }); // end of delete session
}

function addGreeting(){
    createWatsonAssistantSession();
    setTimeout(function(){
        greeting = bot_msg;
        console.log("GREETING: " + greeting);
        var p = document.createElement('p');
        var msg = document.createTextNode(greeting);
        p.appendChild(msg);
        var scroll = document.getElementsByClassName('container');
        scroll[0].appendChild(p);
    }, 4000);  
}

function addChat(){
    var client_div = document.createElement('div');
    client_div.setAttribute('class','container darker');
    var client_img = document.createElement('img');
    // set attribute to client image
    client_img.setAttribute('src','human.png');
    client_img.setAttribute('alt','Avatar');
    client_img.setAttribute('class','right');
    client_div.appendChild(client_img);
   
    // set up the client_msg
    var p = document.createElement('p');
    var b = document.createElement('b');
    var input = document.getElementById('input-box').value
    var client_msg = document.createTextNode(input);
    b.appendChild(client_msg);
    p.appendChild(b);
    client_div.appendChild(p);
    var sp = document.createElement('span');
    var today = new Date();
    var timeToday = today.getHours() + ":" + today.getMinutes();
    var time = document.createTextNode(timeToday);
    sp.appendChild(time);
    sp.setAttribute('class','time-left');
    client_div.appendChild(sp);
    var current = document.getElementsByClassName('chat-scroll');
    current[0].appendChild(client_div);
    document.getElementById('input-box').value=''; // clear the input area
   
     // above deals with the chatbox for the user input
    var assistant_div = document.createElement('div');
    assistant_div.setAttribute('class','container');
    // attribute of robot image
    var assistant_img = document.createElement('img');
    assistant_img.setAttribute('src','robot.png');
    assistant_img.setAttribute('alt','Avatar');
    assistant_div.appendChild(assistant_img);

    var p = document.createElement('p');
    console.log("USER INPUTTTTT: " + input);
    next_question = sendWatsonAssistantMessage(input);
    console.log("NEXT QUESTION: " + next_question); 

    var objDiv = document.getElementById("autoScroll");
    objDiv.scrollTop = objDiv.scrollHeight;
    
    setTimeout(function(){
        next_question = next_question;    
        var text = document.createTextNode(next_question);
        p.appendChild(text);
        assistant_div.appendChild(p);
        var sp = document.createElement('span');
        var today = new Date();
        var timeToday = today.getHours() + ":" + today.getMinutes();
        var time = document.createTextNode(timeToday);
        sp.appendChild(time);
        sp.setAttribute('class','time-right');
        assistant_div.appendChild(sp);
    
        var current = document.getElementsByClassName('chat-scroll');
        current[0].appendChild(assistant_div); 

        var objDiv = document.getElementById("autoScroll");
        objDiv.scrollTop = objDiv.scrollHeight;
    }, 4000);   
    
    

}

module.exports = {addChat: addChat, addGreeting: addGreeting, startSession: createWatsonAssistantSession, sendMessage: sendWatsonAssistantMessage, endSession: deleteWatsonAssistnatSession};
