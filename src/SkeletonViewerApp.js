import THREE from 'three';
import OrbitControls from 'three-orbit-controls';
import 'regenerator-runtime/runtime';
import BinaryParser from './BinaryParser';
import BinaryReader from './BinaryReader';
import FrameStreamer from './FrameStreamer';
// import FrameBuilder from './FrameBuilder';
import FrameParser from './FrameParser';
import FrameManager from './FrameManager';
import ViewerScene from './ViewerScene';
import EventManager from './EventManager';
import SceneBufferManager from './SceneBufferManager';
import SceneObjectBuilder from './SceneObjectBuilder';
import FrameBufferBuilder from './FrameBufferBuilder';
import FrameTransformer from './FrameTransformer';


class SkeletonViewerApp {
  static async start() {
    const app_json = await fetch('app.json').then(res => res.json());

    THREE.OrbitControls = OrbitControls(THREE);

    const frame_buffer_builder = new FrameBufferBuilder(
      Object.assign({ frame_parser: FrameParser }, app_json.scene_opts),
    );

    const frame_transformer = new FrameTransformer({ frame_buffer_builder });

    const frame_streamer_opts = {
      parser: BinaryParser.parser(),
      filenames: [...Array(27).keys()].map(item => `real01_${item}.cal.bin`),
      folder: '../data/',
      binary_reader: BinaryReader,
      frame_transformer,
    };

    const frame_streamer = new FrameStreamer(frame_streamer_opts);

    // Object.assign(app_json.scene_opts, { THREE });
    const scene_object_builder_opts = {
      THREE,
      scene_opts: app_json.scene_opts,
    };

    const scene_object_builder = new SceneObjectBuilder(scene_object_builder_opts);

    const viewer_scene_opts = {
      container: document.getElementById('container'),
      scene_object_builder,
      SceneBufferManager,
      THREE,
      scene_setup_opts: app_json.scene_setup_opts,
    };

    const viewer_scene = new ViewerScene(viewer_scene_opts);

    const frame_manager_opts = {
      frame_streamer,
      viewer_scene,
      frame_transformer,
    };

    const frame_manager = new FrameManager(frame_manager_opts);

    const event_manager_opts = {
      viewer_scene,
      frame_manager,
    };

    // maybe pipe from here

    const event_manager = new EventManager(event_manager_opts);
    event_manager.listenForEvents();
    frame_manager.start();
  }
}

SkeletonViewerApp.start();
export default SkeletonViewerApp;

// float color_map[][3] =  {
//   0 ,       0 ,  0.5625,
//   0 ,       0 ,  0.6250,
//   0 ,       0 ,  0.6875,
//   0 ,       0 ,  0.7500,
//   0 ,       0 ,  0.8125,
//   0 ,       0 ,  0.8750,
//   0 ,       0 ,  0.9375,
//   0 ,       0 ,  1.0000,
//   0 ,  0.0625 ,  1.0000,
//   0 ,  0.1250 ,  1.0000,
//   0 ,  0.1875 ,  1.0000,
//   0 ,  0.2500 ,  1.0000,
//   0 ,  0.3125 ,  1.0000,
//   0 ,  0.3750 ,  1.0000,
//   0 ,  0.4375 ,  1.0000,
//   0 ,  0.5000 ,  1.0000,
//   0 ,  0.5625 ,  1.0000,
//   0 ,  0.6250 ,  1.0000,
//   0 ,  0.6875 ,  1.0000,
//   0 ,  0.7500 ,  1.0000,
//   0 ,  0.8125 ,  1.0000,
//   0 ,  0.8750 ,  1.0000,
//   0 ,  0.9375 ,  1.0000,
//   0 ,  1.0000 ,  1.0000,
//   0.0625 ,  1.0000 ,  0.9375,
//   0.1250 ,  1.0000 ,  0.8750,
//   0.1875 ,  1.0000 ,  0.8125,
//   0.2500 ,  1.0000 ,  0.7500,
//   0.3125 ,  1.0000 ,  0.6875,
//   0.3750 ,  1.0000 ,  0.6250,
//   0.4375 ,  1.0000 ,  0.5625,
//   0.5000 ,  1.0000 ,  0.5000,
//   0.5625 ,  1.0000 ,  0.4375,
//   0.6250 ,  1.0000 ,  0.3750,
//   0.6875 ,  1.0000 ,  0.3125,
//   0.7500 ,  1.0000 ,  0.2500,
//   0.8125 ,  1.0000 ,  0.1875,
//   0.8750 ,  1.0000 ,  0.1250,
//   0.9375 ,  1.0000 ,  0.0625,
//   1.0000 ,  1.0000 ,       0,
//   1.0000 ,  0.9375 ,       0,
//   1.0000 ,  0.8750 ,       0,
//   1.0000 ,  0.8125 ,       0,
//   1.0000 ,  0.7500 ,       0,
//   1.0000 ,  0.6875 ,       0,
//   1.0000 ,  0.6250 ,       0,
//   1.0000 ,  0.5625 ,       0,
//   1.0000 ,  0.5000 ,       0,
//   1.0000 ,  0.4375 ,       0,
//   1.0000 ,  0.3750 ,       0,
//   1.0000 ,  0.3125 ,       0,
//   1.0000 ,  0.2500 ,       0,
//   1.0000 ,  0.1875 ,       0,
//   1.0000 ,  0.1250 ,       0,
//   1.0000 ,  0.0625 ,       0,
//   1.0000 ,       0 ,       0,
//   0.9375 ,       0 ,       0,
//   0.8750 ,       0 ,       0,
//   0.8125 ,       0 ,       0,
//   0.7500 ,       0 ,       0,
//   0.6875 ,       0 ,       0,
//   0.6250 ,       0 ,       0,
//   0.5625 ,       0 ,       0,
//   0.5000 ,       0 ,       0
// };
