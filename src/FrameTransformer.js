import stream from 'stream';

class FrameTransformer extends stream.Transform {

  constructor(options) {
    super({
      readableObjectMode: true,
      writableObjectMode: true,
    });

    Object.assign(this, options);
  }

  _transform(chunk, encoding, done) {
    this.push(this.frame_buffer_builder.build(chunk));
    done();
    // this.push(this.color_frame_builder.convert(this.frame_parser.convert(chunk)));
  }
}
export default FrameTransformer;
