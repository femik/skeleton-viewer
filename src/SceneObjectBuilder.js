class SceneObjectBuilder {
  constructor(options) {
    Object.assign(this, options);
  }

  build(scene_buffer_manager) {
    return scene_buffer_manager.scene_buffers.map(this.buffer_to_scene_object.bind(this));
  }

  buffer_to_scene_object(scene_item) {
    return this.build_scene_object(
      scene_item.xyz,
      scene_item.colors,
      this.scene_opts.sizes[scene_item.id],
    );
  }

  build_scene_object(buffer_attribute, color_buffer_attribute, size) {
    const THREE = this.THREE;
    const geometry = new THREE.BufferGeometry();
    geometry.addAttribute('position', buffer_attribute);
    geometry.addAttribute('color', color_buffer_attribute);
    const material = new THREE.PointsMaterial({
      vertexColors: THREE.VertexColors,
      size,
    });
    return new THREE.Points(geometry, material);
  }
}
export default SceneObjectBuilder;
