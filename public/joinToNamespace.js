function joinToNamespace(endpoint) {
    if(namespaceSocket){
        namespaceSocket.close();
    }
    namespaceSocket = io(`http://192.168.1.7:9000${endpoint}`, {
        query: {
            username
        }
    })
    namespaceSocket.on('LoadRoom',(data)=>{
        const div_list_of_room = document.querySelector('.list-of-room')
        div_list_of_room.innerHTML = ""
        data.namespaceRooms.forEach(room => {
            div_list_of_room.innerHTML += `<li class="room-item">${room.title}</li>`
        });
        const btn_room_item = document.getElementsByClassName('room-item')
        Array.from(btn_room_item).forEach((element) => {
            element.addEventListener("click", e => {
                joinToRoom(e.target.innerText)
                div_room_list.classList.remove('transform-active')
            })
        })
        const firstRoom = document.querySelector('.room-item')
        joinToRoom(firstRoom.innerHTML)

        const spn_channel_name = document.querySelector('.channel-name-of-room')
        spn_channel_name.innerHTML = data.namespaceTitle
    })

    namespaceSocket.on('messageToClient', message => {
        if(document.querySelector('.no-message')) {
            document.querySelector('.no-message').remove()
        }
        document.querySelector('.chat-area').innerHTML += `<div class="message-item ${message.userID === currentUserID && "users-message"}"><span class="username">${message.username}</span><span class="message">${message.message}</span></div>`

        window.scrollTo(0, document.querySelector(".chat-area").offsetHeight);
    })

    document.getElementById('message-form').addEventListener('submit', sendNewMessage)

    function sendNewMessage(event) {
        event.preventDefault()
        let newMessageText = document.getElementById('ipt-message')
        const ipt_roomID = document.getElementById('room-id').value
        if(newMessageText.value.length > 0) 
        namespaceSocket.emit('messageToServer', {message: newMessageText.value, roomID: ipt_roomID, userID: currentUserID})
        newMessageText.value = ""
    }
}