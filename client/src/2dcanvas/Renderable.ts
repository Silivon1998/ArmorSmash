import { vec2, vec4 } from "gl-matrix";
import { InputAction } from "../singletons/Input";
import { Renderer } from "./Renderer";

export class Renderable {
    protected _renderer: Renderer;
    protected _data ?: ImageBitmap;
    protected _renderDirty: boolean = true;

    protected _visible: boolean = true;
    protected _screenPosition: vec2 = vec2.create()

    protected _modulation: vec4 = vec4.fromValues(255, 255, 255, 255);

    constructor(renderer: Renderer, props?: any) {
        this._renderer = renderer;
        renderer.addRenderable(this);


        if (!props) return;
        this.visible = props.visible || this._visible;
        this.modulation = props.modulation || this._modulation;
    }

    public updateRender(ctx: OffscreenCanvasRenderingContext2D) {
        ctx.fillStyle = `rgba(${this._modulation[0]}, ${this._modulation[1]}, ${this._modulation[2]}, ${this._modulation[3] / 255})`;
        ctx.fillRect(0, 0, 100,100);
    }

    public render(ctx : CanvasRenderingContext2D) {
        if (this._data === undefined || this._renderDirty) { this._renderer.draw(this); this._renderDirty = false; }
        ctx.drawImage(this._data as ImageBitmap, this._screenPosition[0],this._screenPosition[1]);
    }

    public set data(value: ImageBitmap) { this._data = value; }
    public get data(): ImageBitmap | undefined { return this._data; }

    public set visible(value: boolean) { this._visible = value; }
    public get visible(): boolean { return this._visible; }

    public set screenPosition(value: vec2) { vec2.copy(this._screenPosition, value); }
    public get screenPosition(): vec2 { return vec2.clone(this._screenPosition); }
    public get screenPositionUS(): vec2 { return this._screenPosition; }

    public set modulation(value: vec4) {
        vec4.copy(value, this._modulation);
        this._renderDirty = true;
    }

    public get modulation(): vec4 { return vec4.clone(this._modulation); }
    public get modulationUS(): vec4 { return this._modulation; } //unsafe getter for critical performance

    public input(action: InputAction) {
        if (action.pressed)
            switch (action.name) {
                case "W":
                    this._screenPosition[1] -= 10;
                    break;
                case "A":
                    this._screenPosition[0] -= 10;
                    break;
                case "S":
                    this._screenPosition[1] += 10;
                    break;
                case "D":
                    this._screenPosition[0] += 10;
                    break;
            }
    }
}