class EventManager {
  constructor(options) {
    Object.assign(this, options);
  }

  listenForEvents() {
    window.addEventListener('resize', this.onWindowResize.bind(this), false);
    window.addEventListener('keypress', this.onKeyPress.bind(this), false);
  }

  onKeyPress(e) {
    const keyPressed = (e.which || e.charCode || e.keyCode || 0);
    if (keyPressed === 111) {
      this.frame_manager.send_next_frame();
    }
  }

  onWindowResize() {
    this.viewer_scene.onWindowResize(window.innerWidth, window.innerHeight);
  }

} // probbly shodul be a module
export default EventManager;
