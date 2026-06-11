function generateRoomId() {
  return Math.floor(100000 + Math.random() * 900000).toString();
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
