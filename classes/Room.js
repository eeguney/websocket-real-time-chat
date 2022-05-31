class Room {

    constructor(id, title, namespaceID) {
        this.id = id;
        this.title = title;
        this.namespaceID = namespaceID;
        this.users = [];
        this.history = []
    }
    
    newMessage(message) {
        this.history.push(message)
    }

    newUser(user) {
        this.users.push(user)
    }

    clearHistory() {
        this.history = []
    }
}

module.exports = Room