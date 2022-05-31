const Namespace = require('../classes/Namespace.js');
const Room = require('../classes/Room.js');

let namespaces = [];

let nsSport = new Namespace(
  0,
  "Sports",
  "",
  "baseball",
  "/sports"
);
let nsMusic = new Namespace(
  1,
  "Music",
  "",
  "music",
  "/music"
);
let nsTechnology = new Namespace(
  2,
  "Technology",
  "",
  "microchip",
  "/technology"
);
let nsCode = new Namespace(
  3,
  "Code",
  "",
  "code",
  "/code"
);


namespaces.push(nsSport, nsMusic, nsTechnology, nsCode);

nsSport.newRoom(new Room(0, "Basketball", 0));
nsSport.newRoom(new Room(1, "Football", 0));
nsSport.newRoom(new Room(2, "Formula", 0));

nsMusic.newRoom(new Room(0, "Rock", 1));
nsMusic.newRoom(new Room(1, "Metal", 1));
nsMusic.newRoom(new Room(2, "Alternative", 1));
nsMusic.newRoom(new Room(3, "Blues", 1));

nsTechnology.newRoom(new Room(0, "Computers", 2));
nsTechnology.newRoom(new Room(1, "Smartphones", 2));

nsCode.newRoom(new Room(0, "Frontend", 3));
nsCode.newRoom(new Room(1, "Backend", 3));
nsCode.newRoom(new Room(2, "Mobile", 3));
nsCode.newRoom(new Room(3, "Desktop", 3));
nsCode.newRoom(new Room(4, "AI", 3));

module.exports = namespaces;