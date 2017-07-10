// import { pick as permit } from 'lodash.pick';

class SceneBuilder {
  static build(options) {
    const THREE = options.THREE;
    const renderer = new THREE.WebGLRenderer({ antialias: false });
    const camera = new THREE.PerspectiveCamera(27, window.innerWidth / window.innerHeight, 5, 3500);
    camera.position.z = options.json.camera_position_z;
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(
      parseInt(options.json.fog_color, 16),
      options.json.fog_near,
      options.json.fog_far,
    );
    renderer.setClearColor(scene.fog.color);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    return { camera, controls, renderer, scene };
  }
  // class with one static method should just be a standalone method
}

class ViewerScene {
  constructor(options) {
    Object.assign(this, options);
    const scene_builder_opts = {
      json: this.scene_setup_opts,
      THREE: this.THREE,
    };

    Object.assign(this, SceneBuilder.build(scene_builder_opts));
    this.initialised = false;
    // initialised when first frame arrives and becomes drawable
    // TODO maybe ViewerScene should be created with first frame
    // maybe scene_buffer_manager shoudl update frame directly
  }

  add_initial_frame(initial_frame) {
    this.scene_buffer_manager = new this.SceneBufferManager({
      THREE: this.THREE,
      initial_frame,
    });
    console.log()
    const scene_objs = this.scene_object_builder.build(this.scene_buffer_manager);
    this.scene.add(...scene_objs);
    this.finish_init();
  }

  finish_init() {
    this.container.appendChild(this.renderer.domElement);
    this.initialised = true;
    this.animate();
  }

  update_frame(frame) {
    if (this.initialised) {
      this.scene_buffer_manager.update_frame(frame);
    } else {
      this.add_initial_frame(frame);
    }
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));
    this.render();
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  onWindowResize(width, height) {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }
}

export default ViewerScene;
