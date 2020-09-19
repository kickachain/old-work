/**
 * Holograph Parallax Class - moves layers at different scroll speeds to create a parallax effect.
 *
 * @class SiriusOsParallax
 */
class SiriusOsParallax {
    private _mobileWidth = 650;
    private _selectors: ISelectors = {
        commonClass: '.parallax-layer',
        wrapper: 'parallax-wrapper',
        uniqWrapperCount: 'prllx-wrpper-',
        inView: 'prllx-in-view',
    };
    private _parallaxStructure: IParallaxProperties = {};
    constructor( /*config?: IParallaxProperties*/) {
        if (this._getWindowWidth() > this._mobileWidth) {
            if (this._findParallaxWrappers() === true) {
                this._addFakeDataAttributes();
                this.setUpParallaxes();
                this._parallaxEvents();
            }
            else {
                // tslint:disable-next-line:no-console
                console.error('cannot find parallax wrappers needed to make this class work');
            }
        }
    }
    private _getWindowWidth() {
        return $(window).width();
    }
    private _addFakeDataAttributes() {
        setTimeout(() => {
            $('.prllx-wrpper-0').attr({ data_noMouse: true, data_noScroll: true });
            $('.prllx-wrpper-0 .parallax-layer-one').attr({ data_speed: '1', data_zindex: '1'});
            $('.prllx-wrpper-0 .parallax-layer-two').attr({ data_speed: '2', data_zindex: '2' });
            $('.prllx-wrpper-0 .parallax-layer-three').attr({ data_speed: '3', data_zindex: '3' });
            $('.prllx-wrpper-0 .parallax-layer-four').attr({ data_speed: '4', data_zindex: '4' });
            $('.prllx-wrpper-1 .parallax-layer-one').attr({ data_speed: '1', data_zindex: '5' });
            $('.prllx-wrpper-1 .parallax-layer-two').attr({ data_speed: '2', data_zindex: '6' });
            $('.prllx-wrpper-1 .parallax-layer-three').attr({ data_speed: '3', data_zindex: '7' });
            $('.prllx-wrpper-1 .parallax-layer-four').attr({ data_speed: '4', data_zindex: '8' });
        }, 3000);
    }
    // checks if there even is a parallax wrapper on the page to run the program
    // multiple wrappers on the page are given a unique class with a count
    private _findParallaxWrappers() {
        let wrapperCanBeFound = false;
        if ($('.' + this._selectors.wrapper).length) {
            wrapperCanBeFound = true;
        }
        return wrapperCanBeFound;
    }
    private setUpParallaxes() {
        $('.' + this._selectors.wrapper).each((index, wrapperElement) => {
            this._addUniqueWrapperIndicator(index, wrapperElement);
            this._createParallaxStructure(index, wrapperElement);
            // tslint:disable-next-line:no-console
            console.log(this._parallaxStructure, 'current state of structure');
            const layers = wrapperElement.querySelectorAll(this._selectors.commonClass);
            this._getLayers(layers, wrapperElement, index);
            layers.forEach((item, count, nodeList) => {
                this._setParallaxSceneProperties(item, count, nodeList);
            });
        });
    }
    private _createParallaxStructure(index: number, _wrapper: Element) {
        const layers = _wrapper.querySelectorAll(this._selectors.commonClass);
        return (this._parallaxStructure[this._selectors.uniqWrapperCount + index] = { wrapperConfig: this._getWrappersConfig(_wrapper), layers });
    }
    private _getWrappersConfig(_wrapper: Element){
        var noMouseValue = (/true/i).test(_wrapper.getAttribute('data_noMouse')) //returns true
        
        return { noMouse : _wrapper.getAttribute('data_noMouse'), noScroll : _wrapper.getAttribute('data_noScroll') };
    }
    private _addUniqueWrapperIndicator(index: number, wrapper: Element) {
        return wrapper.classList.add(this._selectors.uniqWrapperCount + index);
    }
    private _getLayers(layers: NodeListOf<Element>, _wrapperElement: HTMLElement, _index: number) {
        return layers;
    }
    private _getLayerSpeed(layer: Element) {
        layer.getAttribute('data_speed');
        return layer.getAttribute('data_speed');
    }
    private _getLayerZindex(layer: Element) {
        layer.getAttribute('data_zindex');
        return layer.getAttribute('data_zindex');
    }
    private _setParallaxSceneProperties(item: Element, _layerIndex: number, _layerNodes: NodeListOf<Element>) {
        return {
            speed: this._getLayerSpeed(item),
            z_index: this._getLayerZindex(item),
        };
    }
    // returns the bottom position of the window for comparisons
    private _getWindowBottomPos() {
        const $window = $(window);
        const $windowHeight = $window.height();
        const $windowTopPosition = $window.scrollTop();
        return $windowTopPosition + $windowHeight;
    }
    // window events the parallax's uses are declared here
    private _parallaxEvents() {
        // layers react to how far the user has scrolled
        $(window).on('scroll', () => {
            this._inViewIndicator();
            this._parallaxObjectScroll();
        });
        // layers react to the mouse movement
        $(window).mousemove(event => {
            this._parallaxMouseMove(event);
        });
    }
    // adds and removes a class indicating if a parallax is within view or not.
    private _inViewIndicator() {
        $('.' + this._selectors.wrapper).each(index => {
            const $currentParallax = $('.' + this._selectors.uniqWrapperCount + index);
            // outerheight true counts the margins around the element also.
            const $wrapperBottom = $currentParallax.position().top + $currentParallax.outerHeight(true);
            if ($currentParallax.offset().top < this._getWindowBottomPos()) {
                $currentParallax.addClass(this._selectors.inView);
            }
            if ($wrapperBottom < $(window).scrollTop() || $currentParallax.offset().top > this._getWindowBottomPos()) {
                $currentParallax.removeClass(this._selectors.inView);
            }
        });
    }
    // manipulates the layers within a parallax based on the users scroll
    private _parallaxObjectScroll() {
        const scrolled = $(window).scrollTop();
        for (const wrapper of Object.keys(this._parallaxStructure)) {
            if ($('.' + wrapper).hasClass(this._selectors.inView)) {
                const layerNodeList = this._parallaxStructure[wrapper].layers;
                layerNodeList.forEach((layer: Element, _key: number, _parent: NodeListOf<Element>) => {
                    const speed = Number(layer.getAttribute('data_speed'));
                    $(layer).css('top', -(scrolled * speed) / 25 + '%');
                });
            }
        }
    }
    // manipulates the layers within a parallax based on the users mouse movement
    private _parallaxMouseMove(event: JQuery.MouseMoveEvent<Window, null, Window, Window>) {
        const t = (8 - 1) * $(window).height();
        for (const wrapper of Object.keys(this._parallaxStructure)) {
            if ($('.' + wrapper).hasClass(this._selectors.inView)) {
                const layerNodeList = this._parallaxStructure[wrapper].layers;
                layerNodeList.forEach((layer: Element, _key: number, _parent: NodeListOf<Element>) => {
                    const speed = Number(layer.getAttribute('data_speed'));
                    const y = (speed * (t - event.pageY + 200)) / 60;
                    const x = (speed * (-event.pageX + 100)) / 40;
                    $(layer).css('transform', 'translate(' + x + 'px,' + y + 'px)');
                });
            }
        }
    }
}

interface IParallaxProperties {
    [key: string]: IWrapper;
}

interface IWrapper {
    wrapperConfig: IWrapperConfig;
    layers: NodeListOf<Element>;
}

interface IWrapperConfig {
    noMouse: boolean;
    noScroll: boolean;
}

interface ILayerProperties {
    speed: number;
    z_index: number;
}

interface ISelectors {
    commonClass: string;
    wrapper: string;
    uniqWrapperCount: string;
    inView: string;
}
