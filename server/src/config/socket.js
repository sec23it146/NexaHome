let ioInstance = null;

export const setIO = (io) => {
  ioInstance = io;
};

export const emitToUser = (userId, event, payload) => {
  if (ioInstance && userId) ioInstance.to(String(userId)).emit(event, payload);
};

export const emitAll = (event, payload) => {
  if (ioInstance) ioInstance.emit(event, payload);
};
