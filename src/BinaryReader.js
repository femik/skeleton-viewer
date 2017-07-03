class BinaryReader {
  static build_buffer(filename) {
    return fetch(new Request(filename))
      .then((response) => {
        return response.arrayBuffer();
      })
      .then(ab => new Buffer(new Uint8Array(ab)));
  }
}
// https://www.npmjs.com/package/node-web-streams
export default BinaryReader;
