// Im not sure what is better to use, sockets with use data.
// or just fetch them from db. or even a better way, use express-session package?
const getConnectedUsers = (io) => {
  const sockets = Array.from(io.of("/").sockets.values());
  return sockets.map((s) => s.data.user).filter((user) => !!user);
};

module.exports = {
  getConnectedUsers,
};
