document.getElementById("body").style.height = window.innerHeight + "px";
window.addEventListener("resize", () => {
  document.getElementById("body").style.height = window.innerHeight + "px";
});


let username;
let currentUserID;
let currentUserFromStorage;

if (!window.localStorage.getItem("currentUser")) {
  username = prompt("What is your username?");
  currentUserID = Math.floor(Math.random() * 100000 * 100000);
  const newUser = { username, currentUserID }
  window.localStorage.setItem("currentUser", JSON.stringify(newUser))
  currentUserFromStorage = newUser
} else {
  username = JSON.parse(window.localStorage.getItem("currentUser")).username
  currentUserID = JSON.parse(window.localStorage.getItem("currentUser")).currentUserID
}
console.log(`username: ${username}, id: ${currentUserID}`)

const socket = io("http://192.168.1.7:9000", {
  query: {
    username,
  },
});

window.addEventListener("unload", function () {
  socket.emit("userLeave", currentUserID);
});

let namespaceSocket = "";

socket.on("connect", (data) => {
  socket.on("namespaceList", (namespaceitem) => {
    console.log("bak")
    let channelDiv = document.querySelector("#channel-select");
    channelDiv.innerHTML = `<h2>Channels</h2>`;
    namespaceitem.forEach((item) => {
      let namespaceuserCount = 0;
      item.rooms.map((room) => (namespaceuserCount += room.users.length));
      channelDiv.innerHTML += `<button class="namespace" type="button" ns=${item.endpoint}><span><i class="fa-solid fa-${item.icon}"></i><label>${item.title}</label></span><span class="namespace-active-users">${namespaceuserCount}</span></button>`;
    });
    setTimeout(() => {
      Array.from(document.getElementsByClassName("namespace")).forEach(
        (element) => {
          element.addEventListener("click", (e) => {
            const namespaceEndpoint = element.getAttribute("ns");
            joinToNamespace(namespaceEndpoint);
          });
        }
      );
    }, 200);
  });

  joinToNamespace("/sports");
});


const btn__show_room_list = document.querySelector("#btn--show-room-list");
const btn__hide_room_list = document.querySelector("#btn--hide-room-list");
const div_room_list = document.querySelector(".room-list");
const btn_toggle_image_select = document.querySelector(
  ".btn--toggle-image-select"
);
const div_hidden_image_select = document.querySelector(".hidden-image-select");
const btn_room_setting = document.querySelector(".btn--room-settings");
const div_room_setting = document.querySelector(".room-settings");

const ipt_roomID = document.getElementById("room-id").value;

btn__show_room_list.addEventListener("click", () => {
  div_room_list.classList.toggle("transform-active");
});

btn_toggle_image_select.addEventListener("click", () => {
  div_hidden_image_select.classList.toggle("translate-y-0");
});

const btn_show_user_list = document.querySelector(".show-user-list");
const div_user_list_item = document.querySelector(".user-list-of-room");

btn_room_setting.addEventListener("click", () => {
  div_room_setting.classList.toggle("translate-y-0");
});

btn_show_user_list.addEventListener("click", () => {
  div_room_list.classList.toggle("translate-y-0");
  div_user_list_item.classList.toggle("visible-user-list");
});
