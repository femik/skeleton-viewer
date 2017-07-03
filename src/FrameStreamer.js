// import fetchStream from 'fetch-readablestream';
// import nwstream from 'node-web-streams';
import 'regenerator-runtime/runtime';
import readableWebToNode from './readableWebToNode';

class FrameStreamer {
  constructor(options) {
    // this.filename = options.filename;
    // this.parser = options.parser;
    // this.binary_reader = options.binary_reader;
    // this.frame_transformer = options.frame_transformer;
    // this.folder = options.folder;
    Object.assign(this, options);
    this.parser.pipe(this.frame_transformer);
    // fold binary parser into this class
  }

  get_stream() {
    return this.frame_transformer;
  }

  start_firefox_stream() {
    this.binary_reader.build_buffer(this.filename)
      .then((buffer) => {
        this.parser.write(buffer);
        // probably need to write null
      })
      .catch(error => console.log(error));
  }

  start_chrome_stream() {
    fetch(this.filename)
      .then((response) => {
        const node_stream = readableWebToNode(response.body);
        node_stream.pipe(this.parser);
      })
      .catch(error => console.log(error));
  }

  start_multiple_stream() {
    let streamIndex = 0;

    const nextStream = async () => {
      const currentStream = await fetch(this.folder + this.filenames[streamIndex++])
        .then(response => readableWebToNode(response.body))
        .catch(error => console.log(error));

      currentStream.pipe(this.parser, { end: false });

      if (streamIndex === this.filenames.length) {
        this.parser.push(null);
      } else {
        console.log(`stream ${streamIndex}`);
        currentStream.once('end', nextStream);
      }
    };

    nextStream();
  }
}
export default FrameStreamer;
