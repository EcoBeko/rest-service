export default (...args) => {
  for (const arg of args) {
    if (!arg) return true;
  }

  return false;
};
