import { vec2 } from "gl-matrix";
import { Input, InputAction } from "../singletons/Input";
import { Renderable } from "./Renderable";

export const RESOLUTION = {
    /** 16:9 Aspect Ratio Resolutions */
    ASPECT_16_9: {
        /** Standard Definition (SD 16:9) */
        SD: [640, 360],

        /** Standard Definition Plus (SD+ 16:9) */
        SD_PLUS: [960, 540],

        /** High Definition (HD 720p 16:9) */
        HD: [1280, 720],

        /** HD+ (Slightly above 720p 16:9) */
        HD_PLUS: [1600, 900],

        /** Full HD (1080p 16:9) */
        FULL_HD: [1920, 1080],

        /** Quad HD (2K 1440p 16:9) */
        QHD: [2560, 1440],

        /** Quad HD+ (Higher than 1440p but not quite 4K 16:9) */
        QHD_PLUS: [3200, 1800],

        /** Ultra HD 4K (2160p 16:9) */
        UHD_4K: [3840, 2160],

        /** Ultra HD 8K (4320p 16:9) */
        UHD_8K: [7680, 4320]
    },

    /** 16:10 Aspect Ratio Resolutions */
    ASPECT_16_10: {
        /** WXGA (Wide XGA 16:10) */
        WXGA: [1280, 800],

        /** WSXGA+ (16:10) */
        WSXGA_PLUS: [1680, 1050],

        /** WUXGA (16:10) */
        WUXGA: [1920, 1200],

        /** WQXGA (2K 16:10) */
        WQXGA: [2560, 1600],

        /** 4K UHD+ (16:10) */
        UHD_4K_PLUS: [3840, 2400]
    },

    /** 4:3 Aspect Ratio Resolutions */
    ASPECT_4_3: {
        /** XGA (4:3) */
        XGA: [1024, 768],

        /** SXGA (4:3) */
        SXGA: [1280, 960],

        /** UXGA (4:3) */
        UXGA: [1600, 1200],

        /** QXGA (2K 4:3) */
        QXGA: [2048, 1536]
    },

    /** 21:9 Ultra-Wide Resolutions */
    ASPECT_21_9: {
        /** 1080p Ultra-Wide (21:9) */
        UW_FHD: [2560, 1080],

        /** 1440p Ultra-Wide (21:9) */
        UW_QHD: [3440, 1440],

        /** 4K Ultra-Wide (21:9) */
        UW_UHD_4K: [5120, 2160]
    }
};


export class Renderer {

    private _FPS = 0;
    private _delta = 0;
    private _deltaMS = 0;
    private _prevMS = 0;

    private viewport: HTMLCanvasElement = document.createElement("canvas");
    private ctx: CanvasRenderingContext2D;

    private drawCanvas: OffscreenCanvas = new OffscreenCanvas(1, 1);
    private drawCtx: OffscreenCanvasRenderingContext2D;

    private ratio: number = 1;
    private TARGET__SCREEN_SIZE: vec2 = vec2.clone(RESOLUTION.ASPECT_16_9.HD);
    private _SCREEN_SIZE: vec2 = vec2.create();
    private _HALF_SCREEN_SIZE: vec2 = vec2.create();

    private _boundRender: (ms: number) => void;
    private _boundResize: () => void;
    private _animationFrameLoop: number | null = null;

    private RENDERABLE_QUEUE = new Set<Renderable>();

    constructor(parent: HTMLElement = document.body) {
        this.ctx = this.viewport.getContext("2d") as CanvasRenderingContext2D;
        this.drawCtx = this.drawCanvas.getContext("2d") as OffscreenCanvasRenderingContext2D;

        this.viewport.tabIndex = 0;
        this.viewport.focus();
        parent.appendChild(this.viewport);

        Input.actionSignal.connect(this.input.bind(this));

        this._boundRender = this.render.bind(this);
        this._boundResize = this.onResize.bind(this);

        this._boundResize();

        window.addEventListener("resize", this._boundResize);

    }

    onResize() {
        this.ratio = this.viewport.clientWidth / this.viewport.clientHeight;
        let width = this.TARGET__SCREEN_SIZE[0], height = this.TARGET__SCREEN_SIZE[1];

        if (this.ratio >= 1) height = this.TARGET__SCREEN_SIZE[0] / this.ratio;
        else width = this.TARGET__SCREEN_SIZE[1] * this.ratio;

        this.viewport.width = width;
        this.drawCanvas.width = width;
        this._SCREEN_SIZE[0] = width;
        this._HALF_SCREEN_SIZE[0] = width * 0.5;

        this.viewport.height = height;
        this.drawCanvas.height = height;
        this._SCREEN_SIZE[1] = height;
        this._HALF_SCREEN_SIZE[1] = height * 0.5;

    }

    render(ms: number = 0) {
        this._deltaMS = ms - this._prevMS;
        this._delta = this._deltaMS / 16.67;

        // Update prevMS
        this._prevMS = ms;

        // Calculate FPS
        this._FPS = Math.floor(1000 / this._deltaMS);

        this.ctx.clearRect(0, 0, this._SCREEN_SIZE[0], this._SCREEN_SIZE[1]);
        for (const r of this.RENDERABLE_QUEUE) {
            r.visible && r.render(this.ctx);
        }

        this._animationFrameLoop = requestAnimationFrame(this._boundRender);
    }

    draw(r: Renderable) {
        console.log("draw");

        this.drawCtx.clearRect(0, 0, this._SCREEN_SIZE[0], this._SCREEN_SIZE[1]);
        r.updateRender(this.drawCtx);
        r.data = this.drawCanvas.transferToImageBitmap();
        this.drawCtx.reset();
    }

    input(action: InputAction) {
        //to be changed -- r.visible to r.active
        for (const r of this.RENDERABLE_QUEUE) r.visible && r.input(action);
    }

    start() {
        this._animationFrameLoop = requestAnimationFrame(this._boundRender);
    }

    stop() {
        this._animationFrameLoop && cancelAnimationFrame(this._animationFrameLoop);
    }

    addRenderable(r: Renderable) {
        this.RENDERABLE_QUEUE.add(r);
    }

    removeRenderable(r: Renderable) {
        this.RENDERABLE_QUEUE.delete(r);
    }

    get SCREEN_SIZE() { return vec2.clone(this._SCREEN_SIZE); }
}

