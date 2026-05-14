const bcrypt = require("bcryptjs");
const { randomUUID } = require("crypto");

const studioUserId = "local-studio-user";
const adminUserId = "local-admin-user";

const users = [
  {
    _id: studioUserId,
    name: "Innoverse Studio",
    email: "studio@photofly.com",
    password: bcrypt.hashSync("password123", 12),
    role: "photographer",
    avatar: "",
    banned: false,
    plan: "studio",
    createdAt: new Date("2026-01-15T00:00:00.000Z"),
    updatedAt: new Date("2026-01-15T00:00:00.000Z"),
  },
  {
    _id: adminUserId,
    name: "PhotoFly Admin",
    email: "admin@photofly.com",
    password: bcrypt.hashSync("admin1234", 12),
    role: "admin",
    avatar: "",
    banned: false,
    plan: "studio",
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
    updatedAt: new Date("2026-01-01T00:00:00.000Z"),
  },
];

const events = [
  {
    _id: "local-event-wedding-gala-2026",
    name: "Shrestha Wedding Gala",
    date: new Date("2026-05-18T00:00:00.000Z"),
    code: "PF-SWG-72A9",
    photographerId: studioUserId,
    description: "AI sorting is underway for the wedding gallery.",
    coverImage:
      "https://images.pexels.com/photos/1589216/pexels-photo-1589216.jpeg?auto=compress&cs=tinysrgb&w=900&h=620&fit=crop",
    photoCount: 1840,
    searchCount: 34,
    downloadCount: 126,
    isActive: true,
    status: "AI sorting",
    progress: 72,
    createdAt: new Date("2026-05-01T00:00:00.000Z"),
    updatedAt: new Date("2026-05-01T00:00:00.000Z"),
  },
  {
    _id: "local-event-brand-launch-2026",
    name: "Everest Brand Launch",
    date: new Date("2026-05-27T00:00:00.000Z"),
    code: "PF-EBL-4C18",
    photographerId: studioUserId,
    description: "Client gallery is ready to share.",
    coverImage:
      "https://images.pexels.com/photos/301987/pexels-photo-301987.jpeg?auto=compress&cs=tinysrgb&w=900&h=620&fit=crop",
    photoCount: 960,
    searchCount: 18,
    downloadCount: 82,
    isActive: true,
    status: "Ready to share",
    progress: 100,
    createdAt: new Date("2026-04-28T00:00:00.000Z"),
    updatedAt: new Date("2026-04-28T00:00:00.000Z"),
  },
  {
    _id: "local-event-portrait-weekend-2026",
    name: "Portrait Weekend",
    date: new Date("2026-06-03T00:00:00.000Z"),
    code: "PF-PWE-9F30",
    photographerId: studioUserId,
    description: "Uploads are being prepared.",
    coverImage:
      "https://images.pexels.com/photos/1239288/pexels-photo-1239288.jpeg?auto=compress&cs=tinysrgb&w=900&h=620&fit=crop",
    photoCount: 420,
    searchCount: 6,
    downloadCount: 19,
    isActive: true,
    status: "Upload pending",
    progress: 28,
    createdAt: new Date("2026-04-21T00:00:00.000Z"),
    updatedAt: new Date("2026-04-21T00:00:00.000Z"),
  },
];

const photos = [];

function cleanUser(user) {
  if (!user) return null;
  const { password, ...safeUser } = user;
  return { ...safeUser };
}

function cleanEvent(event) {
  if (!event) return null;
  return { ...event };
}

function cleanPhoto(photo) {
  if (!photo) return null;
  return { ...photo };
}

function createCode(name) {
  const initials = (name || "Event")
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();
  return `PF-${initials || "EVT"}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

async function createUser({ name, email, password, role = "user" }) {
  const now = new Date();
  const user = {
    _id: randomUUID(),
    name,
    email: email.toLowerCase().trim(),
    password: await bcrypt.hash(password, 12),
    role,
    avatar: "",
    banned: false,
    plan: role === "photographer" ? "studio" : "free",
    createdAt: now,
    updatedAt: now,
  };
  users.push(user);
  return cleanUser(user);
}

function findUserByEmail(email) {
  return users.find((user) => user.email === String(email || "").toLowerCase().trim());
}

function findUserById(id) {
  return cleanUser(users.find((user) => user._id === id));
}

async function comparePassword(user, password) {
  return bcrypt.compare(password, user.password);
}

function listEventsForUser(user) {
  const filtered = user.role === "admin" ? events : events.filter((event) => event.photographerId === user._id);
  return filtered
    .slice()
    .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))
    .map(cleanEvent);
}

function findEventById(id) {
  return cleanEvent(events.find((event) => event._id === id));
}

function findEventByCode(code) {
  return cleanEvent(events.find((event) => event.code === String(code || "").toUpperCase() && event.isActive));
}

function createEvent(user, data) {
  const now = new Date();
  const event = {
    _id: randomUUID(),
    name: data.name,
    date: data.date ? new Date(data.date) : now,
    code: data.code || createCode(data.name),
    photographerId: user._id,
    description: data.description || "",
    coverImage: data.coverImage || data.cover || "",
    photoCount: Number(data.photoCount) || 0,
    searchCount: 0,
    downloadCount: 0,
    isActive: true,
    status: data.status || "Upload pending",
    progress: Number(data.progress) || 0,
    createdAt: now,
    updatedAt: now,
  };
  events.unshift(event);
  return cleanEvent(event);
}

function updateEvent(id, user, data) {
  const event = events.find((item) => item._id === id);
  if (!event) return null;
  if (user.role !== "admin" && event.photographerId !== user._id) return null;

  Object.assign(event, {
    ...data,
    coverImage: data.coverImage || data.cover || event.coverImage,
    updatedAt: new Date(),
  });

  if (data.date) event.date = new Date(data.date);
  if (data.photoCount !== undefined) event.photoCount = Number(data.photoCount) || 0;
  if (data.progress !== undefined) event.progress = Math.min(100, Math.max(0, Number(data.progress) || 0));
  return cleanEvent(event);
}

function deleteEvent(id, user) {
  const index = events.findIndex((event) => event._id === id);
  if (index === -1) return false;
  if (user.role !== "admin" && events[index].photographerId !== user._id) return false;
  events.splice(index, 1);
  return true;
}

function listPhotosForEvent(eventId) {
  return photos
    .filter((photo) => !eventId || photo.eventId === eventId)
    .slice()
    .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))
    .map(cleanPhoto);
}

function addPhotos(eventId, user, uploadedFiles) {
  const event = events.find((item) => item._id === eventId);
  if (!event) return null;
  if (user.role !== "admin" && event.photographerId !== user._id) return null;

  const now = new Date();
  const createdPhotos = uploadedFiles.map((file) => {
    const photo = {
      _id: randomUUID(),
      eventId,
      url: file.url,
      publicId: file.publicId,
      thumbnailUrl: file.thumbnailUrl || file.url,
      width: file.width,
      height: file.height,
      facesCount: 0,
      faces: [],
      indexed: false,
      tags: ["local-upload"],
      uploadedBy: user._id,
      createdAt: now,
      updatedAt: now,
    };
    photos.push(photo);
    return cleanPhoto(photo);
  });

  event.photoCount = (Number(event.photoCount) || 0) + createdPhotos.length;
  event.updatedAt = now;
  return createdPhotos;
}

function deletePhoto(photoId, user) {
  const index = photos.findIndex((photo) => photo._id === photoId);
  if (index === -1) return null;

  const photo = photos[index];
  const event = events.find((item) => item._id === photo.eventId);
  if (event && user.role !== "admin" && event.photographerId !== user._id) return null;

  photos.splice(index, 1);
  if (event) {
    event.photoCount = Math.max(0, (Number(event.photoCount) || 0) - 1);
    event.updatedAt = new Date();
  }
  return cleanPhoto(photo);
}

module.exports = {
  users,
  events,
  photos,
  cleanUser,
  cleanPhoto,
  createUser,
  findUserByEmail,
  findUserById,
  comparePassword,
  listEventsForUser,
  findEventById,
  findEventByCode,
  createEvent,
  updateEvent,
  deleteEvent,
  listPhotosForEvent,
  addPhotos,
  deletePhoto,
};
