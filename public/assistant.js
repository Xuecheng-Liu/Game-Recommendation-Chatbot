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
let language_val = "";
let is_Google = false;
let intent_id = 0;
let name_id = "";
let is_search = false;
let is_genre = false;

const assistant = new AssistantV2({
    version: '2019-02-28',
    authenticator: new IamAuthenticator({
        apikey: api_key,
    }),
    url: url,
});

async function createWatsonAssistantSession(){
    try{
        const session = await assistant.createSession({
            assistantId: assistant_id
        });
        console.log(JSON.stringify(session.result, null, 2)); // for checking JSON response from Watson
        session_id = session.result.session_id.toString();
        //console.log("Session created!, session id: " + session_id);
            
        let input_message = "hello";
        console.log("Input message: " + input_message);
    
        const messege = await sendWatsonAssistantMessage(input_message);
        bot_msg = messege;  
        console.log("Initial message: " + bot_msg);
        
    }
    catch (e) {
        console.log('error', e);
        return null;
    }
}

async function sendWatsonAssistantMessage(input_message){
    try{
        const message = await assistant.message({
            assistantId: assistant_id,
            sessionId: session_id,
            input: {
                'message_type': 'text',
                'text': input_message
            }
        });
        console.log(JSON.stringify(message.result, null, 2)); // for checking JSON response from Watson
        let generic = message.result.output.generic; // array of responses
        var i;
        let response = '';
        for(i = 0; i<generic.length; i++){
            response = response.concat(generic[i].text.toString() + '\n');
        } 
        next_question = response;
        // Platforms { PC: 94, ps3: 35, wii: 90, gamecube: 23, xbox: 32, xbox360: 340 }
        let intents = message.result.output.intents;
        if(intents.length != 0){
            let intent = intents[0].intent;
            console.log(intent);
            if(intent == "platform_PC"){
                console.log("IM IN PC");
                intent_id = 94;
            }else if(intent == "platform_ps"){
                console.log("IM IN PS");
                intent_id = 35;
            }else if(intent == "platform_Xbox"){
                console.log("IM IN XBOX");
                intent_id = 340;
            }else if(intent == "platform_Switch"){
                console.log("IM IN Nintendo");
                intent_id = 90;
            }
        }
        console.log("Watson Assistant response: " + next_question);
        return response;
    }
    catch (e) {
        console.log('error', e);
        return null;
    }
}

async function deleteWatsonAssistnatSession(){
    try{
        await assistant.deleteSession({
            assistantId: assistant_id,
            sessionId: session_id,
        })
        console.log("Session deleted!");
        window.location.href = 'web.html';
    }
    catch (e) {
      console.log('error', e);
      return null;
    }
}

async function addChat(){
    try{
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
        console.log("USER INPUT: " + input);
        if(language_val != ""){
            input = await translate(language_val + "-en", input);
            console.log("USER INPUT: " + input);
            if(is_Google == true){
                input = await translate(language_val + "-en", input);
            }
        } 

        const match = input.match(/[\uac00-\ud7af]|[\u1100-\u11ff]|[\u3130-\u318f]|[\ua960-\ua97f]|[\ud7b0-\ud7ff]/g);
        const match2 = input.match(/[\u4E00-\u9FCC\u3400-\u4DB5\uFA0E\uFA0F\uFA11\uFA13\uFA14\uFA1F\uFA21\uFA23\uFA24\uFA27-\uFA29]|[\ud840-\ud868][\udc00-\udfff]|\ud869[\udc00-\uded6\udf00-\udfff]|[\ud86a-\ud86c][\udc00-\udfff]|\ud86d[\udc00-\udf34\udf40-\udfff]|\ud86e[\udc00-\udc1d]/g);
        //input == "사회과학원 어학연구소" || input == "社會科學院語學研究所" || input == "(｡◕ ∀ ◕｡)"
        if(match ? match.length === input.length : false){
            //Korean
            next_question = "Sorry I did not understand, can you repeat your answer?";
        }else if(match2 ? match2.length === input.length : false){
            //Chinese
            next_question = "Sorry I did not understand, can you repeat your answer?";
        }else{
            next_question = await sendWatsonAssistantMessage(input);
        }
        console.log("next_question: " + next_question);

        if(language_val != ""){
            next_question = await translate("en-" + language_val, next_question);
            if(is_Google == true){
                next_question = await translate("-en" + language_val, next_question);
            }
        } 

        var objDiv = document.getElementById("autoScroll");
        objDiv.scrollTop = objDiv.scrollHeight;

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

        if(is_search == false){
            await addGames(intent_id);
        }else{
            if(is_genre == false){
                await addGamesSearchName(input);
            }else{
                await addGamesSearchGenre(input);
            }
        }
    }
    catch (e) {
        console.log('error', e);
        return null;
    }
}

const LanguageTranslatorV3 = require('ibm-watson/language-translator/v3');

let api_key2 = 'u5CyWhz0rS5u1vsd-WjbiQ5IwOE34Tw4YxeBjDfaDMTh'; 
let url2 = 'https://api.us-south.language-translator.watson.cloud.ibm.com/instances/1f8350bc-f2bc-4a6d-a1d5-4b49845d6497'; 

const languageTranslator = new LanguageTranslatorV3({
  version: '2018-05-01',
  authenticator: new IamAuthenticator({
    apikey: api_key2,
  }),
  url: url2,
});

async function setLanguage(text){
    try{
        var input = document.getElementById('input-box').value;
        input.innerHTML = '';
        identifiedLanguages = await languageTranslator.listIdentifiableLanguages();
        let languages = identifiedLanguages.result.languages;
        let lang = ""
        let name = ""
        var i;
        console.log("input = " + input);
        for(i = 0; i<languages.length; i++){
            if(input.toLowerCase() == languages[i].name.toString().toLowerCase()){
                name = languages[i].name.toString().toUpperCase();
                lang = languages[i].language.toString();
            }
        } 
        let model1 = lang + "-en";
        let model2 = "en-" + lang;
        translationModels = await languageTranslator.listModels();
        let models = translationModels.result.models;
        let available1 = false;
        let available2 = false;
        var i;
        for(i = 0; i<models.length; i++){
            if(model1 == models[i].model_id.toString()){
                available1 = true;
            }
            if(model2 == models[i].model_id.toString()){
                available2 = true;
            }
        } 
        if(available1 == true && available2 == true){
            language_val = lang;
            console.log(language_val);
            // above deals with the chatbox for the user input
            var assistant_div = document.createElement('div');
            assistant_div.setAttribute('class','container');
            // attribute of robot image
            var assistant_img = document.createElement('img');
            assistant_img.setAttribute('src','robot.png');
            assistant_img.setAttribute('alt','Avatar');
            assistant_div.appendChild(assistant_img);
    
            var p = document.createElement('p');
            let trans = await translate("en-" + lang, "Which platform do you prefer to play on?")
            var text = document.createTextNode("Language is set to " + name + " " + trans);
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
        }else{
            // above deals with the chatbox for the user input
            var assistant_div = document.createElement('div');
            assistant_div.setAttribute('class','container');
            // attribute of robot image
            var assistant_img = document.createElement('img');
            assistant_img.setAttribute('src','robot.png');
            assistant_img.setAttribute('alt','Avatar');
            assistant_div.appendChild(assistant_img);
    
            var p = document.createElement('p');
    
            var text = document.createTextNode("Language not available, try another language or continue with English");
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
        }
    }
    catch (e) {
        console.log('error', e);
        return null;
    }
}

async function translate(lang, text){
    try{
        const translateParams = {
          text: text,
          modelId: lang,
        };
        translationResult = await languageTranslator.translate(translateParams);
        let trans = translationResult.result.translations[0].translation.toString();
        return trans;
    }
    catch (e) {
        console.log('error', e);
        return null;
    }
}

// Imports the Google Cloud client library
const {Translate} = require('@google-cloud/translate').v2;

const projectId = 'translate-1583364768180';
// Instantiates a client
const translate_Google = new Translate({projectId});

async function translateText(lang, text) {
    try {
        // Translates some text into Russian
        const [translation] = await translate_Google.translate(text, lang);
        console.log(`Text: ${text}`);
        console.log(`Translation: ${translation}`);
        return text;
    } catch (error) {
        console.error(error.details);
    }
}

// Platforms { PC: 94, ps3: 35, wii: 90, gamecube: 23, xbox: 32, xbox360: 340 }

const giantbomb = require('giantbomb');
const gb = giantbomb('9412c1963be4f5697f6ffc0013f5140a53a73a33');
async function addGames(id) {
    try {
        // Display details for Mass Effect.
        const config = {
            fields: ['id', 'name','image','site_detail_url'],
            page: 1,
            perPage: 10,
            sortBy: 'original_game_rating',
            sortDir: 'desc',
            filters: [
              { field: 'platforms', value: id ,image: 'image'}
            ]
        };
        await gb.games.list(config, (err, res, json) => {
            console.log("ID: ", id);
            console.log(json.results);
            //remove before picture
            var element = document.getElementById("recommendList");
            element.innerHTML = '';
            //add game list
            var i = 0;
            for (i=0; i<json.results.length; i++){
                var node = document.createElement("div");
                node.setAttribute('style', "color:black");
                node.setAttribute('class','gallery');
                //var textnode = document.createTextNode();
                var img = new Image(); 
                var a = document.createElement('a');
                img.src = json.results[i].image.small_url;
                img.setAttribute("height", "300");
                img.setAttribute("weight", "500");
                console.log(json.results[i].site_detail_url);
                url = json.results[i].site_detail_url
                a.href = url;
                a.appendChild(img);
                var node_name = document.createElement("div");
                node_name.setAttribute('style', "color:black");
                var textnode = document.createTextNode(json.results[i].name);
                node_name.appendChild(textnode);
                a.appendChild(node_name);
                //img.onclick = function() {
                  //window.location.href = url;
                //};
                //node.appendChild(textnode);
                node.appendChild(a);
                document.getElementById("recommendList").appendChild(node);
            }
            is_search = true;
        });
    } catch (error) {
      console.error(error.details);
    }
}

async function addGamesSearchName(name) {
    try {
        // Display details for Mass Effect.
        const config = {
            fields: ['id', 'name','image','site_detail_url'],
            page: 1,
            perPage: 10,
            sortBy: 'original_game_rating',
            sortDir: 'desc',
            filters: [
              { field: 'name', value: name },
              { field: 'platforms', value: intent_id }
            ]
        };
        is_genre = true;
        name_id = name;
        await gb.games.list(config, (err, res, json) => {
            console.log(json.results);
            //remove before picture
            var element = document.getElementById("recommendList");
            element.innerHTML = '';
            //add game list
            var i = 0;
            for (i=0; i<json.results.length; i++){
                var node = document.createElement("div");
                node.setAttribute('style', "color:black");
                node.setAttribute('class','gallery');
                //var textnode = document.createTextNode();
                var img = new Image(); 
                var a = document.createElement('a');
                img.src = json.results[i].image.small_url;
                img.setAttribute("height", "300");
                img.setAttribute("weight", "500");
                console.log(json.results[i].site_detail_url);
                url = json.results[i].site_detail_url
                a.href = url;
                a.appendChild(img);
                var node_name = document.createElement("div");
                node_name.setAttribute('style', "color:black");
                var textnode = document.createTextNode(json.results[i].name);
                node_name.appendChild(textnode);
                a.appendChild(node_name);
                //img.onclick = function() {
                  //window.location.href = url;
                //};
                //node.appendChild(textnode);
                node.appendChild(a);
                document.getElementById("recommendList").appendChild(node);
            }
        });
    } catch (error) {
      console.error(error.details);
    }
}

async function addGamesSearchGenre(genre) {
    try {
        const config = {
            fields: ['id', 'name','image','site_detail_url'],
            page: 1,
            perPage: 10,
            sortBy: 'original_game_rating',
            sortDir: 'desc',
            filters: [
                { field: 'genres', value: genre },
                { field: 'platforms', value: intent_id },
                { field: 'names', value: name_id }
            ]
        };
        await gb.games.list(config, (err, res, json) => {
            console.log(json.results);
            //remove before picture
            var element = document.getElementById("recommendList");
            element.innerHTML = '';
            //add game list
            var i = 0;
            for (i=0; i<json.results.length; i++){
                var node = document.createElement("div");
                node.setAttribute('style', "color:black");
                node.setAttribute('class','gallery');
                //var textnode = document.createTextNode();
                var img = new Image(); 
                var a = document.createElement('a');
                img.src = json.results[i].image.small_url;
                img.setAttribute("height", "300");
                img.setAttribute("weight", "500");
                console.log(json.results[i].site_detail_url);
                url = json.results[i].site_detail_url
                a.href = url;
                a.appendChild(img);
                var node_name = document.createElement("div");
                node_name.setAttribute('style', "color:black");
                var textnode = document.createTextNode(json.results[i].name);
                node_name.appendChild(textnode);
                a.appendChild(node_name);
                //img.onclick = function() {
                  //window.location.href = url;
                //};
                //node.appendChild(textnode);
                node.appendChild(a);
                document.getElementById("recommendList").appendChild(node);
            }
        });
    } catch (error) {
      console.error(error.details);
    }
}

module.exports = {addGames:addGames, translateText:translateText, setLanguage: setLanguage, translate:translate, addChat: addChat,  
    startSession: createWatsonAssistantSession, sendMessage: sendWatsonAssistantMessage, endSession: deleteWatsonAssistnatSession};
