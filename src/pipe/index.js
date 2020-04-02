import { EventEmitter2 } from "eventemitter2";

const pipe = new EventEmitter2({
  wildcard: true,
  delimiter: "::"
});

export function init() {
  pipe.on("system::setup", () => {
    console.info("| Event pipe ready");
  });
}

export default pipe;
