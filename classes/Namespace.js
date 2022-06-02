class Namespace {
  constructor(id = 0, title, img, icon, endpoint) {
    this.id = id;
    this.title = title;
    this.img = img;
    this.icon = icon;
    this.endpoint = endpoint;
    this.rooms = [];
  }

  newRoom(room) {
    this.rooms.push(room);
  }

  leaveAll(userID) {
      console.log(userID)
    const test = this.rooms.map((room) => {
        return(
            {...room, users: room.users.filter((user) => user.userID !== userID)}
        )
    } )
  }
}

// room.users.filter((user) => user.userID !== userID)

module.exports = Namespace;
