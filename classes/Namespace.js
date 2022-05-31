class Namespace {

    constructor(id = 0, title, img, icon, endpoint) {
        this.id = id;
        this.title = title;
        this.img = img;
        this.icon = icon;
        this.endpoint = endpoint;
        this.rooms = []
    }

    newRoom(room) {
        this.rooms.push(room)
    }

    deleteRoom(roomID) {
        this.rooms 
    }

}

module.exports = Namespace