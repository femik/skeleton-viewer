

class FrameManager {
  constructor(options) {
    this.frame_streamer = options.frame_streamer;
    this.viewer_scene = options.viewer_scene;
    this.frame_cursor = 0;
    this.frame_array = [];
    this.has_data = false;
    this.stream = this.frame_streamer.get_stream();
  }

  start() {
    // this.stream.on('readable', this.onNewFrame.bind(this));
    this.stream.on('finish', () => {
      console.log('stream ended');
      // this.has_data = false;
      // should be in frame streamer now
    });
    this.frame_streamer.start_multiple_stream();
  }

  onNewFrame() {
    let e;
    while (e = this.stream.read()) {
      this.update_frame_data(e);
    }
  }

  update_frame_data(formatted_color_frame) {
    this.frame_array.push(formatted_color_frame);

    if (!this.has_data) {
      this.has_data = true;
      this.send_next_frame();
    }
  }

  next_frame() {
    this.frame_cursor = (this.frame_cursor + 1) % this.frame_array.length;
    return this.frame_array[this.frame_cursor];
  }

  send_next_frame() {
    const frame = this.stream.read();
    if (frame) {
      this.viewer_scene.update_frame(frame);
    } else {
      console.log("no frame available");
    }
  }
}
export default FrameManager;
