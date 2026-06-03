function generateRoomId(length = 6) {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    let roomId = "";

    for (let i = 0; i < length; i++) {
        roomId += chars.charAt(
            Math.floor(Math.random() * chars.length)
        );
    }

    return roomId;
}

function generatePassword(length = 4) {
    let password = "";

    for (let i = 0; i < length; i++) {
        password += Math.floor(Math.random() * 10);
    }

    return password;
}

module.exports = {
    generateRoomId,
    generatePassword,
};