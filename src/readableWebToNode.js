import stream from 'stream';

class NodeReadable extends stream.Readable {
  constructor(webStream, options) {
    super(options);
    this._webStream = webStream;
    this._reader = webStream.getReader();
    this._reading = false;
  }

  _read(size) {
    if (this._reading) {
      return;
    }
    this._reading = true;
    const doRead = () => {
      this._reader.read()
        .then(res => {
          if (res.done) {
            this.push(null);
            return;
          }
          // could make Uint8Array to Buffer transform
          if (this.push(new Buffer(res.value))) {
            return doRead(size);
          } else {
            this._reading = false;
          }
        });
    };
    doRead();
  }
}

function readableWebToNode(webStream) {
  return new NodeReadable(webStream);
}

export default readableWebToNode;
