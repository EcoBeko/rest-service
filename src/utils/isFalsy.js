export default (...args) => {
  for (const arg of args) {
    if (arg == undefined) return true;
  }

  return false;
};
