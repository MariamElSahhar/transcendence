import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/0.170.0/three.module.min.js";

export class HandlePaddleEdge {
  #begin = new THREE.Vector2();
  #end = new THREE.Vector2();
  #vector = new THREE.Vector2();

  constructor(begin, end, vector = null) {
    this.#begin.set(begin.x, begin.y);
    this.#end.set(end.x, end.y);
    if (vector !== null) {
      this.#vector.set(vector.x, vector.y);
    } else {
      this.#vector.set(end.x - begin.x, end.y - begin.y);
    }
  }

  intersect(paddleEdge) {
    const t1Top = (paddleEdge.end.x - paddleEdge.begin.x) *
                  (this.#begin.y - paddleEdge.begin.y) -
                  (paddleEdge.end.y - paddleEdge.begin.y) *
                  (this.#begin.x - paddleEdge.begin.x);

    const t2Top = (paddleEdge.begin.y - this.#begin.y) *
                  (this.#begin.x - this.#end.x) -
                  (paddleEdge.begin.x - this.#begin.x) *
                  (this.#begin.y - this.#end.y);

    const bottom = (paddleEdge.end.y - paddleEdge.begin.y) *
                   (this.#end.x - this.#begin.x) -
                   (paddleEdge.end.x - paddleEdge.begin.x) *
                   (this.#end.y - this.#begin.y);

    if (bottom === 0) {
      return { intersection: null, t: null };
    }

    const t1 = t1Top / bottom;
    if (t1 < 0 || t1 > 1) {
      return { intersection: null, t: null };
    }

    const t2 = t2Top / bottom;
    if (t2 < 0 || t2 > 1) {
      return { intersection: null, t: null };
    }

    return {
      intersection: new THREE.Vector2(
        this.#begin.x + t1 * (this.#end.x - this.#begin.x),
        this.#begin.y + t1 * (this.#end.y - this.#begin.y)
      ),
      t: t1,
    };
  }

  get begin() {
    return this.#begin;
  }

  get end() {
    return this.#end;
  }

  get vector() {
    return this.#vector;
  }
}

