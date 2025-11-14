if (typeof global.MessageChannel === "undefined") {
  global.MessageChannel = function () {
    let port1 = {};
    let port2 = {};

    port1.postMessage = (data) => {
      setTimeout(() => {
        if (typeof port2.onmessage === "function") {
          port2.onmessage({ data });
        }
      }, 0);
    };

    port2.postMessage = (data) => {
      setTimeout(() => {
        if (typeof port1.onmessage === "function") {
          port1.onmessage({ data });
        }
      }, 0);
    };

    return { port1, port2 };
  };
}