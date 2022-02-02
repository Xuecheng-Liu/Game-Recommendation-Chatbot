const AssistantV2 = require('ibm-watson/assistant/v2');
const { IamAuthenticator } = require('ibm-watson/auth');
//const readline = require('readline').createInterface({ input: process.stdin, output: process.stdout }) 

let api_key = 'mQm5M8FKoDrr6kHa2egihXw9Y7p1XvyoEEjPdRKoyd1f'; //Bowen's
let url = 'https://api.us-south.assistant.watson.cloud.ibm.com/instances/8332649b-5341-4b1d-acd7-d09c5dca8c97'; //Bowen's
let assistant_id = '62dfbaa1-b17c-4bfa-8693-5c3be0e12d19'; //Bowen's

/*
let api_key = 'PMDpVBUyLC7XpKV-N9hUSmvaY6cWUkEKlXtd3apcOCxh';
let url = 'https://api.us-south.assistant.watson.cloud.ibm.com/instances/b730816f-f905-4b51-94bc-e0b83114e73d';
let assistant_id = 'ffa3c0ac-2506-402f-a3c5-a3ee89c9eb10';
*/

let session_id = "";
let message_array = [];
message_array[0] = "playstation";
message_array[1] = "dota"
let index = 0;
let is_final = 0;

function createMessage(assistant, assistant_id, session_id, input_message){
    const message =assistant.message({
        assistantId: assistant_id,
        sessionId: session_id,
        input: {
            'message_type': 'text',
            'text': input_message
        }
    });
    return message
}

function messageThen(message, is_final){
    message.then(res => {
        console.log(JSON.stringify(res.result, null, 2)); // for checking JSON response from Watson
        let generic = res.result.output.generic
        var i;
        let response = '';
        for(i = 0; i<generic.length; i++){
            response = response.concat(generic[i].text.toString() + '\n');
        }
        console.log("Watson Assistant response: " + response);

        //@@@@@@@@@@@@@@@@@@@@@@@TODO: response Watson create div

        if(is_final){
            assistant.deleteSession({
                assistantId: assistant_id,
                sessionId: session_id,
            })
                .then(res => {
                    console.log("Session deleted!");
                })
                .catch(err => {
                    console.log(err);
                })
            ; // end of delete session

        }else{
            //@@@@@@@@@@@@@@@@@@@@@@@TODO: read in user input and create div

            //user_input = getInput();
            //readline.question("Enter input: ", user_input => { console.log("Input message: " + user_input); readline.close();});
            //readline.question("Is this final?: ", is_final => { console.log("Is final: " + is_final); readline.close(); });
            if(index < message_array.length){
                console.log("Input message: " + message_array[index]);
                message = createMessage(assistant, assistant_id, session_id, message_array[index]);
                index++;
                if(index-1 == message_array.length-1){
                    is_final = 1;
                    messageThen(message, is_final);
                }else{
                    messageThen(message, is_final);
                }
            }
        }
    });
}

const assistant = new AssistantV2({
    version: '2019-02-28',
    authenticator: new IamAuthenticator({
        apikey: api_key,
    }),
    url: url,
});

const session = assistant.createSession({
    assistantId: assistant_id
});

session.then(res => {
    console.log(JSON.stringify(res.result, null, 2)); // for checking JSON response from Watson
    session_id = res.result.session_id.toString();
    //console.log("Session created!, session id: " + session_id);

    let input_message = "hello";
    console.log("Input message: " + input_message);
    //let response = "";
    //let intent = "";

    message = createMessage(assistant, assistant_id, session_id, input_message);
    messageThen(message);
})
; // end of session




