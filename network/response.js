function success(req, res, status, msg) {
  res.status(status || 200).send({
    error: false,
    body: msg,
    status: status || 200,
  });
}

function error(req, res, status, msg) {
  res.status(status || 500).send({
    error: true,
    body: msg,
    status: status || 500,
  });
}

module.exports = {
  success,
  error,
};
