
var req = new XMLHttpRequest(); 
req.open('GET', '/chat/render_message', false); 
req.send({});
const message = req.response


req = new XMLHttpRequest(); 
req.open('GET', '/chat/render_user_message', false); 
req.send({});
const user_message = req.response

const room_id = document.getElementById('room_id').textContent;
const messages_per_minute = document.getElementById('messages_per_minute').textContent;
const time_between_messages = document.getElementById('time_between_messages').textContent;

document.querySelector('#chat-message-input').focus();
document.querySelector('#chat-message-submit').onclick = function (e) {
    e.preventDefault()

    const messageInputDom = document.querySelector('#chat-message-input');
    const messageFileInput = document.getElementById('file');
    const messageImageInput = document.getElementById('image');
    const message = messageInputDom.value;
    console.log(document.getElementById('image').value)
    if (message === "" && messageImageInput.value == null && messageFileInput.value  == null){
        return
    }

    var req = new XMLHttpRequest(); 
    req.open('POST', '/chat/send_message', true); 
    req.overrideMimeType("application/json");
    formData = new FormData(document.querySelector('form'));
    formData.append("user",document.getElementById('user_id').textContent);
    formData.append("chatroom", room_id);
    formData.append("message", message);
    req.onload  = function() {
        messageInputDom.value = '';
        messageFileInput.value = null;
        messageImageInput.value = null;
    }
    req.send(formData);
};

let last_time = "0";
kickeableCount = 0 

setInterval(function() {
    var req = new XMLHttpRequest(); 
    req.open('GET', '/chat/get_messages/'+room_id+"/"+ last_time, true);
    req.overrideMimeType("application/json");
    req.onload  = function() {
        var jsonResponse = JSON.parse(req.responseText);
        
        var chatLog = document.getElementById('chat-log');
        var scrollable = false;
        if (chatLog.scrollTop == (chatLog.scrollHeight - chatLog.offsetHeight)) {
            scrollable = true;
        }
        for (let index = 0; index < jsonResponse.length; index++) {
            const data = jsonResponse[index];
            console.log(data)
            last_time = data.last_time;
            switch (data.type) {
                case "chat_message":
                    var x = document.createElement('div')
                    if(document.getElementById('user_id').textContent == data.userId){
                        x.style.display= 'flex'
                        x.style.justifyContent = 'flex-end'
                        x.innerHTML = user_message
                    }else{
                        x.innerHTML = message
                    }
                    x.innerHTML = x.innerHTML.replace('__user__', data.userName)
                    if(data.message != ""){
                        x.innerHTML = x.innerHTML.replace('__messagge__', data.message)
                    }else{                        
                        x.querySelector("#chat-message").remove();
                    }
                    if(data.file !== "/media/"){
                        x.querySelector("#fileLinkMessage").setAttribute("href", data.file)
                    }else{
                        x.querySelector("#fileLinkMessage").remove();       
                    }
                    if(data.image !== "/media/"){
                        x.querySelector("#imageMessage").setAttribute("src", data.image) 
                        x.querySelector("#imageMessageLink").setAttribute("href", data.image)
                                
                    }else{
                        x.querySelector("#imageMessage").remove();  
                        x.querySelector("#imageMessageLink").remove();
                    }
    
                    document.getElementById('chat-log').appendChild(x)
                    break;
                case "kick_message":
                    console.log(data)
                    if(document.getElementById('user_id').textContent == data.userId){
                            if(kickeableCount >= jsonResponse.length){
                                alert(data.message);
                                window.location.replace("/");
                            }
                    }else{
                        var x = document.createElement('div')
                        x.style.display= 'flex'
                        x.style.justifyContent = 'flex-end'
                        x.innerHTML = user_message
                        x.innerHTML = x.innerHTML.replace('__user__', data.userName)
                        x.innerHTML = x.innerHTML.replace('__messagge__', data.message)
                        x.querySelector("#fileLinkMessage").remove();    
                        x.querySelector("#imageMessage").remove();  
                        x.querySelector("#imageMessageLink").remove();
                        document.getElementById('chat-log').appendChild(x)                    
                    }
                    break;
                case "ban_message":
                    if(document.getElementById('user_id').textContent == data.userId){
                        if(kickeableCount >= jsonResponse.length){
                            alert(data.message)
                            window.location.replace("/");
                        }
                    }else{
                        var x = document.createElement('div')
                        x.style.display= 'flex'
                        x.style.justifyContent = 'flex-end'
                        x.innerHTML = user_message
                        x.innerHTML = x.innerHTML.replace('__user__', data.userName)
                        x.innerHTML = x.innerHTML.replace('__messagge__', data.message)
                        x.querySelector("#fileLinkMessage").remove();    
                        x.querySelector("#imageMessage").remove();  
                        x.querySelector("#imageMessageLink").remove();
                        document.getElementById('chat-log').appendChild(x)                    
                    }
                case "user_leave":
                    
                default:
                    break;
            }
            kickeableCount++
        }
        if(scrollable){
            chatLog.scrollTop = chatLog.scrollHeight
        }
    }
    req.send();

}, 1000);
