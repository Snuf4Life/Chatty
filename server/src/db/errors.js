// inspired by conflict http error 409
class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.name = ConflictError;
  }
}

module.exports = {
  ConflictError,
};
