const {
    ADD_MESSAGE,
    GET_MESSAGES,
    UPDATE_ROOM_USERS,
    GET_ROOMS,
    GET_ROOM_USERS
} = require('../actions/socketio');

module.exports = {
    JOIN_ROOM: (socket, data) => {
        console.log('[JOIN_ROOM]', data);
        socket.join(data.room);
    }
};
