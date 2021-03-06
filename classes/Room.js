class Room {
  constructor(id, title, namespaceID) {
    this.id = id;
    this.title = title;
    this.namespaceID = namespaceID;
    this.users = [];
    this.history = [];
  }

  newMessage(message) {
    this.history.push(message);
  }

  newUser(user) {
    this.users.push(user);
  }

  userLeave(userID) {
    this.users = this.users.filter((user) => user.userID !== userID);
  }

  clearHistory() {
    this.history = [];
  }
}

module.exports = Room;
