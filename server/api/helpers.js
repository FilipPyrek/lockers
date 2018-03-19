const handleError = (res) => (error) => {
  if (error.isJoi && error.name === 'ValidationError') {
    res.json({
      code: 400,
      error: error.details.reduce(
        (errors, err) => Object.assign(
          errors,
          {
            [err.path]: err.message,
          }
        )
      , {}),
    });
    return;
  }
  console.error(error); // eslint-disable-line no-console
  res.status(500).json({
    code: 500,
    error: 'Internal Server Error',
  });
};

module.exports = {
  handleError,
};
