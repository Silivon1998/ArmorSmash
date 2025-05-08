/* Define a generic Signal class where T is a tuple of argument types*/
export class Signal<T extends any[]> {
    private listeners: Set<(...args: T) => void> = new Set();

    // Subscribe to the signal
    public connect(listener: (...args: T) => void): void {
        this.listeners.add(listener);
    }

    // Unsubscribe from the signal
    public disconnect(listener: (...args: T) => void): void {
        this.listeners.delete(listener);
    }

    // Dispatch the signal to all listeners with the provided arguments
    public dispatch(...args: T): void {
        for (var listener of this.listeners) listener(...args);
    }
}