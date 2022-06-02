function joinToRoom(roomTitle) {
  const ipt_roomID = document.querySelector("#room-id");

  ipt_roomID.setAttribute("data-room-title", roomTitle);

  namespaceSocket.emit("joinToRoom", {
    roomTitle,
    roomToLeave: ipt_roomID.getAttribute("data-room-title"),
    userID: currentUserID,
  });

  const spn_user_list_room_name = document.querySelector(
    ".user-list-of-room-name"
  );
  spn_user_list_room_name.innerHTML = roomTitle;

  const div_chat_area = document.querySelector(".chat-area");
  div_chat_area.innerHTML = "";

  namespaceSocket.on("getHistoryofRoom", (data) => {
    div_chat_area.innerHTML = "";

    const spn_room_name = document.querySelector(".room-name");
    spn_room_name.innerHTML = roomTitle;

    ipt_roomID.value = data.roomID;

    if (data.history.length === 0) {
      div_chat_area.innerHTML = `<div class="no-message">There is no message...</div>`;
      return;
    }
    data.history.forEach((message) => {
      if (message.image) {
        div_chat_area.innerHTML += `<div class="message-item ${
          message.userID === currentUserID && "users-message"
        }"><span class="username">${
          message.username
        }</span><span class="message-image"><img src="${
          message.image
        }" height="200" /></span></div>`;
      } else {
        div_chat_area.innerHTML += `<div class="message-item ${
          message.userID === currentUserID && "users-message"
        }"><span class="username">${
          message.username
        }</span><span class="message">${message.message}</span></div>`;
      }
    });
  });

  namespaceSocket.on("getUserList", (userList) => {
    let div_user_list = document.querySelector(".user-list-ul");

    div_user_list.innerHTML = "";

    document.querySelector(
      ".active-user-counter"
    ).innerHTML = `<strong>${userList.length} users</strong> is online`;

    document.querySelector(".room-title-counter").innerHTML = `${userList.length} users`
    userList.forEach((user) => {
      div_user_list.innerHTML += `<li>${user.username}</li>`;
    });

    document
      .querySelector("#btn--hide-room-list")
      .addEventListener("click", () => {
        div_room_list.classList.toggle("transform-active");
      });
  });
    namespaceSocket.emit("refreshNamespaceList", {})

}
