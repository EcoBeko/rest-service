export default function (res) {
  return (condition, message, code, status = false) => {
    if (condition) {
      res.status(code).json({
        status,
        message,
      });
      throw new Error("end");
    }
  };
}
