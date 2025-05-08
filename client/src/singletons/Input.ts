import { vec2 } from "gl-matrix";
import { Signal } from "../../../shared/Signal";

export enum InputCode {
    // Keyboard codes
    Escape = "Escape",
    Digit1 = "Digit1",
    Digit2 = "Digit2",
    Digit3 = "Digit3",
    Digit4 = "Digit4",
    Digit5 = "Digit5",
    Digit6 = "Digit6",
    Digit7 = "Digit7",
    Digit8 = "Digit8",
    Digit9 = "Digit9",
    Digit0 = "Digit0",
    Minus = "Minus",
    Equal = "Equal",
    Backspace = "Backspace",
    Tab = "Tab",
    KeyQ = "KeyQ",
    KeyW = "KeyW",
    KeyE = "KeyE",
    KeyR = "KeyR",
    KeyT = "KeyT",
    KeyY = "KeyY",
    KeyU = "KeyU",
    KeyI = "KeyI",
    KeyO = "KeyO",
    KeyP = "KeyP",
    BracketLeft = "BracketLeft",
    BracketRight = "BracketRight",
    Enter = "Enter",
    ControlLeft = "ControlLeft",
    ControlRight = "ControlRight",
    KeyA = "KeyA",
    KeyS = "KeyS",
    KeyD = "KeyD",
    KeyF = "KeyF",
    KeyG = "KeyG",
    KeyH = "KeyH",
    KeyJ = "KeyJ",
    KeyK = "KeyK",
    KeyL = "KeyL",
    Semicolon = "Semicolon",
    Quote = "Quote",
    Backquote = "Backquote",
    ShiftLeft = "ShiftLeft",
    ShiftRight = "ShiftRight",
    IntlBackslash = "IntlBackslash",
    KeyZ = "KeyZ",
    KeyX = "KeyX",
    KeyC = "KeyC",
    KeyV = "KeyV",
    KeyB = "KeyB",
    KeyN = "KeyN",
    KeyM = "KeyM",
    Comma = "Comma",
    Period = "Period",
    Slash = "Slash",
    CapsLock = "CapsLock",
    F1 = "F1",
    F2 = "F2",
    F3 = "F3",
    F4 = "F4",
    F5 = "F5",
    F6 = "F6",
    F7 = "F7",
    F8 = "F8",
    F9 = "F9",
    F10 = "F10",
    F11 = "F11",
    F12 = "F12",
    PrintScreen = "PrintScreen",
    ScrollLock = "ScrollLock",
    Pause = "Pause",
    Insert = "Insert",
    Home = "Home",
    PageUp = "PageUp",
    Delete = "Delete",
    End = "End",
    PageDown = "PageDown",
    ArrowRight = "ArrowRight",
    ArrowLeft = "ArrowLeft",
    ArrowDown = "ArrowDown",
    ArrowUp = "ArrowUp",
    NumLock = "NumLock",
    NumpadDivide = "NumpadDivide",
    NumpadMultiply = "NumpadMultiply",
    NumpadSubtract = "NumpadSubtract",
    NumpadAdd = "NumpadAdd",
    NumpadEnter = "NumpadEnter",
    Numpad1 = "Numpad1",
    Numpad2 = "Numpad2",
    Numpad3 = "Numpad3",
    Numpad4 = "Numpad4",
    Numpad5 = "Numpad5",
    Numpad6 = "Numpad6",
    Numpad7 = "Numpad7",
    Numpad8 = "Numpad8",
    Numpad9 = "Numpad9",
    Numpad0 = "Numpad0",
    NumpadDecimal = "NumpadDecimal",
    NumpadEqual = "NumpadEqual",
    MetaLeft = "MetaLeft",
    MetaRight = "MetaRight",
    F13 = "F13",
    F14 = "F14",
    F15 = "F15",
    F16 = "F16",
    F17 = "F17",
    F18 = "F18",
    F19 = "F19",
    F20 = "F20",
    F21 = "F21",
    F22 = "F22",
    F23 = "F23",
    F24 = "F24",
    Space = "Space",
    /////////////////////////
    MouseLeftButton = 0,
    MouseRightButton = 2,
    MouseMiddleButton = 1,
    MouseWheelUp = "MouseWheelUp",
    MouseWheelDown = "MouseWheelDown",
    MouseMove = "MouseMove"
};

export interface InputAction {
    name: string;
    code: InputCode;
    pressed: boolean;
    released: boolean;
    releaseTimeout?: NodeJS.Timeout;
}

export interface InputMouseData {
    screenPosition: vec2;
    delta: vec2;
    wheelDelta: number;
    buttons: { left: boolean, right: boolean, middle: boolean };
    moveTimeout?: NodeJS.Timeout;
}

export type InputMap = { [action: string]: InputCode };

const DEFAULT_INPUT_MAP: InputMap = {
    "W": InputCode.KeyW,
    "A": InputCode.KeyA,
    "S": InputCode.KeyS,
    "D": InputCode.KeyD,
    "Space": InputCode.Space,
    "ShiftLeft": InputCode.ShiftLeft,
    "LeftMouse": InputCode.MouseLeftButton,
    "MiddleMouse": InputCode.MouseMiddleButton,
    "RightMouse": InputCode.MouseRightButton,
    "MouseWheelDown": InputCode.MouseWheelDown,
    "MouseWheelUp": InputCode.MouseWheelUp,
    "MouseMove": InputCode.MouseMove,
};


export var Input = ((map: InputMap = DEFAULT_INPUT_MAP) => {
    var actionSignal = new Signal<[InputAction]>();
    var ACTIONS = new Map<string, InputAction>();
    var MOUSE: InputMouseData = {
        screenPosition: vec2.create(),
        delta: vec2.create(),
        wheelDelta: 0,
        buttons: { left: false, right: false, middle: false }
    }

    var ACTION_RELEASE_MS: number = 100;

    map && updateInputMap(map);
    onListeners();

    // // Add pointer lock change listener (optional, for debugging).
    // document.addEventListener('pointerlockchange', onPointerLockChange);

    // function onPointerLockChange() {
    //     if (document.pointerLockElement === GPU_CANVAS.HTML_ref) console.log("Pointer locked on canvas.");
    //     else console.log("Pointer unlocked.");
    // }


    function updateInputMap(map: InputMap, clean: boolean = true) {
        if (clean) ACTIONS.clear();

        for (const [key, code] of Object.entries(map)) {
            const inputAction: InputAction = { name: key, code, pressed: false, released: false };
            ACTIONS.set(key, inputAction);
        }
    }

    function onListeners() {
        window.addEventListener('keydown', onKeyDown);
        window.addEventListener('keyup', onKeyUp);
        window.addEventListener('mousedown', onMouseDown);
        window.addEventListener('mouseup', onMouseUp);
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('wheel', onWheel);
    }

    function offListeners() {

        for (var action of ACTIONS.values()) {
            action.pressed = false; action.released = false;
        }

        window.removeEventListener('keydown', onKeyDown);
        window.removeEventListener('keyup', onKeyUp);
        window.removeEventListener('mousedown', onMouseDown);
        window.removeEventListener('mouseup', onMouseUp);
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('wheel', onWheel);

        //document.removeEventListener('pointerlockchange', onPointerLockChange);

    }

    function isAction(action: string) {
        var inputAction = ACTIONS.get(action);
        return inputAction ? (inputAction.pressed || inputAction.released) : false;
    }

    function isActionPressed(action: string) {
        var inputAction = ACTIONS.get(action);
        return inputAction ? inputAction.pressed : false;
    }

    function isActionReleased(action: string) {
        var inputAction = ACTIONS.get(action);
        return inputAction ? inputAction.released : false;
    }

    function onAction(action: InputAction) {
        actionSignal.dispatch(action);
    }

    function onActionDown(code: InputCode) {

        for (var action of ACTIONS.values()) {
            if (code !== action.code) continue;
            action.pressed = true;
            action.released = false;

            onAction(action);
            clearTimeout(action.releaseTimeout);
        }
    }

    function onActionUp(code: InputCode) {
        for (var action of ACTIONS.values()) {
            if (code !== action.code) continue;
            action.pressed = false;
            action.released = true;

            onAction(action);
            action.releaseTimeout = setTimeout(() => { action.released = false }, ACTION_RELEASE_MS);
        }
    }

    function onKeyDown(event: KeyboardEvent) { onActionDown(event.code as InputCode); }
    function onKeyUp(event: KeyboardEvent) { onActionUp(event.code as InputCode); }

    function onMouseDown(event: MouseEvent) {
        // When the mouse is clicked, request pointer lock on the canvas.
        //if (document.pointerLockElement !== GPU_CANVAS.HTML_ref) GPU_CANVAS.HTML_ref.requestPointerLock();

        var code = event.button;

        switch (code) {
            case InputCode.MouseLeftButton: MOUSE.buttons.left = true; break;
            case InputCode.MouseRightButton: MOUSE.buttons.right = true; break;
            case InputCode.MouseMiddleButton: MOUSE.buttons.middle = true; break;
        }

        onActionDown(code);
    }
    function onMouseUp(event: MouseEvent) {
        var code = event.button;

        switch (code) {
            case InputCode.MouseLeftButton: MOUSE.buttons.left = false; break;
            case InputCode.MouseRightButton: MOUSE.buttons.right = false; break;
            case InputCode.MouseMiddleButton: MOUSE.buttons.middle = false; break;
        }

        onActionUp(code);
    }

    function onMouseMove(event: MouseEvent) {
        clearTimeout(MOUSE.moveTimeout);

        vec2.set(MOUSE.delta, event.movementX, event.movementY);
        vec2.set(MOUSE.screenPosition, event.clientX, event.clientY);

        onActionDown(InputCode.MouseMove);
        MOUSE.moveTimeout = setTimeout(() => onActionUp(InputCode.MouseMove), ACTION_RELEASE_MS);
    }

    function onWheel(event: WheelEvent) {
        const delta = event.deltaY;
        const action = delta > 0 ? InputCode.MouseWheelDown : InputCode.MouseWheelUp;
        MOUSE.wheelDelta = delta;
        onActionDown(action);
        setTimeout(() => onActionUp(action), ACTION_RELEASE_MS);
    }

    return {
        actionSignal,

        //mouseData(): InputMouseData { return { ...MOUSE } },
        mousePosition(): vec2 { return vec2.clone(MOUSE.screenPosition) },
        mousePosition_UNSF: MOUSE.screenPosition,

        mouseDelta(): vec2 { return vec2.clone(MOUSE.delta) },
        mouseDelta_UNSF(): vec2 { return MOUSE.delta },

        mouseButtons() { return { ...MOUSE.buttons } },
        mouseButtons_UNSF: MOUSE.buttons,

        isAction,
        isActionPressed,
        isActionReleased,

        updateInputMap,

        onListeners,
        offListeners
    }
})();



