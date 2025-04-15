module.exports = {
  validTask: {
    title: 'Tarea de prueba',
    description: 'Descripción de ejemplo',
    status: 'IN_COURSE',
    priority: 'MEDIUM',
  },

  invalidTask: {
    title: '', // empty title is not allowed
    status: 'INVALID_STATUS', // status not allowed
  },
};
