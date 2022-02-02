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

const assistant = new AssistantV2({
    version: '2019-02-28',
    authenticator: new IamAuthenticator({
        apikey: api_key,
    }),
    url: url,
});

assistant.createSession({
    assistantId: assistant_id
})
    .then(res => {
        console.log(JSON.stringify(res.result, null, 2)); // for checking JSON response from Watson
        session_id = res.result.session_id.toString();
        console.log("Session created!, session id: " + session_id);

        let input_message = "hello";
        console.log("Input message: " + input_message);
        let response = "";
        let intent = "";

        assistant.message({
            assistantId: assistant_id,
            sessionId: session_id,
            input: {
                'message_type': 'text',
                'text': input_message
            }
        })
            .then(res => {
                console.log(JSON.stringify(res.result, null, 2)); // for checking JSON response from Watson
                let generic = res.result.output.generic
                var i;
                for(i = 0; i<generic.length; i++){
                    response = response.concat(generic[i].text.toString());
                }
                console.log("Watson Assistant response: " + response);
                //intent = res.result.output.intents[0].intent.toString();
                //console.log("Recognized intent as: " + intent);
                    
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
            })
            .catch(err => {
                console.log(err);
            })
        ; // end of message
    })
    .catch(err => {
        console.log(err);
    })
; // end of create session




