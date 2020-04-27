export default function (options) {
  return (err, req, res, next) => {
    return res.status(500).send({
      err,
    });
  };
}
