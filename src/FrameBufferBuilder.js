class FrameBufferBuilder {
  constructor(options) {
    Object.assign(this, options);
    this.count = 0;
  }

  build(frame) {
    // const formatted_frame = {
    //   markers: this.frame_parser.get_markers(frame),
    //   points: this.frame_parser.get_points(frame),
    // };

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
      {
        id: 'dijkstra',
        xyz: new Float32Array(this.dijkstra[this.count]),
        colors: this.build_color_array(new Float32Array(this.dijkstra[this.count]), [1, 1, 0]),
      },
    ];
    this.count += 1;
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
    // const color_scheme = [
    //   { threshold: this.far_threshhold, color: colors.far_color },
    //   { threshold: this.near_threshhold, color: colors.near_color },
    //   { threshold: Number.POSITIVE_INFINITY, color: colors.main_color },
    // ];
    const get_color_step = depth => (acc, item) => (
      acc || (depth < item.threshhold ? item.color : null)
    );
    const get_color = (depth, schema) => schema.reduce(get_color_step(depth), null);
    // rewrite as a map
    // maybe foreaech with assign
    // depths are negative
    // color_array.map((elem, i, arr) => {
    //  let z_index = Math.floor(i / 3) * 3 + 2;
    //  let depth = arr[z_index];
    //  color_index = i%3;
    //  return get_color(depth, tri_schema)[color_index];
    // });

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
