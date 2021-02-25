module.exports = (res, message, code) => {
  res.status(code || 200).json({
    success: false,
    message,
  });
};
