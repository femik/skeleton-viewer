class SceneBufferManager {
  constructor(options) {
    // Object.assign(this, { THREE: options.THREE });
    this.THREE = options.THREE;
    this.scene_buffers = this.build_scene_buffers_from_initial_frame(options.initial_frame);
  }

  build_scene_buffers_from_initial_frame(frame) {
    const to_scene_buffer = scene_item => ({
      id: scene_item.id,
      xyz: this.build_buffer_attribute(scene_item.xyz),
      colors: this.build_buffer_attribute(scene_item.colors),
    });
    // could just use to_scene_buffer in constructor

    return frame.map(to_scene_buffer);
  }

  build_buffer_attribute(data) {
    return new this.THREE.BufferAttribute(data, 3).setDynamic(true);
  }

  get(id) {
    return this.scene_buffers.find(item => item.id === id);
  }

  update_frame(frame) {
    const advance_scene_item = (new_scene_item) => {
      const old_scene_item = this.get(new_scene_item.id);
      this.constructor.advance(old_scene_item.xyz, new_scene_item.xyz);
      this.constructor.advance(old_scene_item.colors, new_scene_item.colors);
    };

    frame.forEach(advance_scene_item);
  }

  static advance(current_draw_buffer, next_draw_buffer) {
    current_draw_buffer.set(next_draw_buffer);
    current_draw_buffer.needsUpdate = true;
  }
}
export default SceneBufferManager;
