export class Component extends HTMLElement {
    eventListeners;
	rendered;
    constructor() {
        super();
		this.rendered=false;
        this.eventListeners = new Map();
    }

    render() {}
    postRender() {}
    style() {
        return ``;
    }

    renderComponent() {
        this.innerHTML = this.render() + this.style();
        this.rendered = true;
        this.postRender();
    }

    connectedCallback() {
        if (!this.rendered) {
            this.renderComponent();
        }
    }

    disconnectedCallback() {
        this.removeAllComponentEventListeners();
    }

    attributeChangedCallback() {
        this.innerHTML = this.render() + this.style();
        this.postRender();
    }

    addComponentEventListener(element, event, callback, callbackInstance = this) {
        if (!element) return;

        const eventCallback = callback.bind(callbackInstance);
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, new Set());
        }

        this.eventListeners.get(event).add({ element, eventCallback });
        element.addEventListener(event, eventCallback);
    }

	isRendered()
	{
		return this.rendered;
	}

    removeAllComponentEventListeners() {
        this.eventListeners.forEach((listeners, event) => {
            listeners.forEach(({ element, eventCallback }) => {
                element.removeEventListener(event, eventCallback);
            });
        });
        this.eventListeners.clear();
    }
}

