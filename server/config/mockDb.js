const collections = {
  users: [],
  disasters: [],
  rescuers: [],
  shelters: [],
  notifications: []
};

const getUsers = () => collections.users;
const setUsers = (data) => { collections.users = data; };

const getDisasters = () => collections.disasters;
const setDisasters = (data) => { collections.disasters = data; };

const getRescuers = () => collections.rescuers;
const setRescuers = (data) => { collections.rescuers = data; };

const getShelters = () => collections.shelters;
const setShelters = (data) => { collections.shelters = data; };

const getNotifications = () => collections.notifications;
const setNotifications = (data) => { collections.notifications = data; };

const isDatabaseEmpty = () => {
  return collections.users.length === 0 &&
    collections.disasters.length === 0 &&
    collections.rescuers.length === 0 &&
    collections.shelters.length === 0 &&
    collections.notifications.length === 0;
};

module.exports = {
  getUsers,
  setUsers,
  getDisasters,
  setDisasters,
  getRescuers,
  setRescuers,
  getShelters,
  setShelters,
  getNotifications,
  setNotifications,
  isDatabaseEmpty
};
