import Dissolve from 'dissolve';

class BinaryParser {
  static parser() {
    // const Dissolve = require('dissolve');
    const R = 176;
    const C = 144;
    const N = R * C;

    return Dissolve().loop(function parse() {
      let markers = 0;
      this.int32('MAGIC')
        .int32('frame_number')
        .int64('frame_timestamp')
        .buffer('points', N * 3 * 4)
        .buffer('dist', N * 2)
        .buffer('amp', N * 2)
        .buffer('conf', N * 2)
        .int32('nmarkers')
        .loop('markers', (end) => {
          if (markers++ === 64) {
            return end(true);
          }
          this.int32('id')
            .int32('frame')
            .floatle('x')
            .floatle('y')
            .floatle('z')
            .floatle('cond')
            .uint32('flag');
        })
        .int32('padding')
        .tap(() => {
          this.push(this.vars);
          this.vars = Object.create(null);
        });
    });
  }
}
export default BinaryParser;
