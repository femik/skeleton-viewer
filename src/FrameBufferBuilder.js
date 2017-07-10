class FrameBufferBuilder {
  constructor(options) {
    Object.assign(this, options);
  }

  build(frame) {

    const formatted_frame = this.frame_parser.convert(frame);

    const formatted_color_frame = [
      {
        id: 'points',
        xyz: formatted_frame.points,
        colors: this.build_threshholded_color_array(formatted_frame.points, this.color_scheme),
      },
      {
        id: 'markers',
        xyz: formatted_frame.markers,
        colors: this.build_color_array(formatted_frame.markers, this.marker_color),
      },
    ];
    return formatted_color_frame;
  }

  build_color_array(data, color) {
    return new Float32Array(data.length).map((elem, index) => color[index % 3]);
  }

  build_threshholded_color_array(data, color_scheme) {
    const color_array = new Float32Array(data.length);
    this.assign_colors(data, color_array, color_scheme);
    return color_array;
  }

  assign_colors(data, color_array, color_scheme) {
    // color scheme structure
    // "color_scheme": [
    //   { "threshhold": -4, "color": [0.7, 0.7, 0.7] },
    //   { "threshhold": -2, "color": [0, 0.7, 0] },
    //   { "threshhold": 1e9999, "color": [0, 0, 0.7] }
    // ],
    // TODO review how the colors are assigned

    const get_color_step = depth => (acc, item) => (
      acc || (depth < item.threshhold ? item.color : null)
    );

    const get_color = (depth, schema) => schema.reduce(get_color_step(depth), null);

    const between = (item, first, second) => {
      return item < Math.max(first, second) && item >= Math.min(first, second);
    };

    for (let i = 0; i < data.length; i += 3) {
      this.constructor.assign_color(color_array, i, get_color(data[i + 2], color_scheme));
    }
  }

  static assign_color(color_array, index, color) {
    color_array[index] = color[0];
    color_array[index + 1] = color[1];
    color_array[index + 2] = color[2];
    // [].splice.call(color_array, index, 3, ...color);
    // color_array.splice(index, 3, ...color);
    // color_array.set(color, index);
  }
}
export default FrameBufferBuilder;
