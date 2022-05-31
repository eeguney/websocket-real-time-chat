document.getElementById("body").style.height = window.innerHeight + "px";
window.addEventListener("resize", () => {
  document.getElementById("body").style.height = window.innerHeight + "px";
});

const username = prompt("What is your username?")

const socket = io("http://192.168.1.7:9000", {
  query: {
    username
}
});

let currentUserID = Math.floor(Math.random() * 100000)

let namespaceSocket = "";

socket.on("connect", (data) => {
  socket.on("namespaceList", (item) => {
    let channelDiv = document.querySelector("#channel-select");
    channelDiv.innerHTML = "";
    item.forEach((item) => {
      channelDiv.innerHTML += `<button class="namespace" type="button" ns=${item.endpoint}><i class="fa-solid fa-${item.icon}"></i><label>${item.title}</label></button>`;
    });
  });

  setTimeout(() => {
    Array.from(document.getElementsByClassName('namespace')).forEach((element)=>{
      element.addEventListener('click',(e)=>{
          const namespaceEndpoint = element.getAttribute('ns');
          joinToNamespace(namespaceEndpoint)
      })
  })
  joinToNamespace('/sports')
  }, 200);
  
});

const btn__show_room_list = document.querySelector('#btn--show-room-list')
const btn__hide_room_list = document.querySelector('#btn--hide-room-list')
const div_room_list = document.querySelector('.room-list')

btn__show_room_list.addEventListener('click', () => {
  div_room_list.classList.add('transform-active')
})

btn__hide_room_list.addEventListener('click', () => {
  div_room_list.classList.remove('transform-active')
})
