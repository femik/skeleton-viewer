class FrameParser {
  static get_points(frame) {
    const arrayBuffer = new Uint8Array(frame.points).buffer;
    return new Float32Array(arrayBuffer);
  }

  static get_markers(frame) {
    return new Float32Array(FrameParser.format_marker_data(frame.markers));
  }

  static format_marker_data(marker_data) {
    const marker_array = [];
    marker_data.forEach((elem) => {
      marker_array.push(elem.x);
      marker_array.push(elem.y);
      marker_array.push(elem.z);
      // append [x ,y ,z] if poss
    });
    return marker_array;
  }

  static convert(frame) {
    return {
      markers: FrameParser.get_markers(frame),
      points: FrameParser.get_points(frame),
    };
  }
}
export default FrameParser;
