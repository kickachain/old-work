/*
A class is like a blueprint for code, and can be used many times. so you'll hear things like instance 
(that particular copy of the class). You have methods/functions which do things in the class for you
then you call these when you want it to do something. 

class {
    constructor()
    method_1()
    method_2()
    method_3()
    method_4()
}

this is the fundamental layout above 

a constructor is a special method you use at the start that you want things to be declared straight away.
*/



/*
* class creates an accordion for each faq id sent through the server
*/
class WundermanAccordion {
    _accordionObject: IAccordionObject;
    _accordionClassNames: IAccordionClassNames;
    constructor() {
        this._getAccordionData();

        // so class names can be easily overwrriten if required in the future
        this._accordionClassNames = {
            accordion: 'accordion',
            header: 'header',
            expandIcon: 'expand-icon',
            expanded: 'expanded',
            expander: 'expander',
            question: 'question',
            answer: 'answer'
        }
    }

    /*
    * gets the object from the server, if this fails it throws an error and the class fails
    */
    private _getAccordionData():void {
        const url = 'https://api.myjson.com/bins/jw3rg';

        //promise for the request
        fetch(url)
            .then(res => res.json())
            .then((out: IAccordionObject) => {
                // made this a property of the class so i can access it anywhere i need to
                this._accordionObject = out;
                this._setUpAccordionsWithData();
            })
            .catch(err => { throw err });
    }

    /*
    * sets up the data with the dynamically made accordions
    */
    private _setUpAccordionsWithData():void {
        for (let faqs in this._accordionObject.faqs) {
            let id = this._accordionObject.faqs[faqs].id;
            let question = this._accordionObject.faqs[faqs].question;
            let answer = this._accordionObject.faqs[faqs].answer;
            this._createAccordion(id);
            this._setAccordionHeaderText(id, question);
            this._setAccordionIconContent(id);
            this._setAccordionExpanderText(id, answer);
            this._accordionEventHandler(id);
        }
    }

    /*
    * creates all the components required to make an accordion
    */
    private _createAccordion(id: number):void {
        const accordionWrapper = this._createElement('div', this._accordionClassNames.accordion);
        const header = this._createElement('div', this._accordionClassNames.header);
        const headerQuestion = this._createElement('H2', this._accordionClassNames.question);
        const headerExpand = this._createElement('span', this._accordionClassNames.expandIcon);
        const expander = this._createElement('div', this._accordionClassNames.expander);
        const expanderAnswer = this._createElement('p', this._accordionClassNames.answer);
        accordionWrapper.classList.add('faq-' + id);
        header.appendChild(headerQuestion);
        header.appendChild(headerExpand);
        expander.appendChild(expanderAnswer);
        accordionWrapper.appendChild(header);
        accordionWrapper.appendChild(expander);
        document.body.appendChild(accordionWrapper);
    }

    /*
    * creates an element with a class name
    */
    private _createElement(elementype: string, elementClassName: string):HTMLElement {
        const element = document.createElement(elementype);
        element.classList.add(elementClassName);
        return element;
    }

    /*
    * adds the question to the accordion header
    */
    private _setAccordionHeaderText(id: number, question: string):void {
        const faqElement = document.querySelector('.faq-' + id);
        const headingElement = faqElement.querySelector('.' + this._accordionClassNames.question);
        const textNode = document.createTextNode('Q:' + question);
        headingElement.appendChild(textNode);
    }

    /*
    * adds the answer to the accordion expanding block
    */
    private _setAccordionExpanderText(id: number, answer: string):void {
        const faqElement = document.querySelector('.faq-' + id);
        const expandingElement = faqElement.querySelector('.' + this._accordionClassNames.answer);
        const textNode = document.createTextNode(answer);
        expandingElement.appendChild(textNode);
    }

    /*
    * adds content to the icon span
    */
    private _setAccordionIconContent(id: number):void {
       const faqElement = document.querySelector('.faq-' + id);
       const iconElement = faqElement.querySelector('.' + this._accordionClassNames.expandIcon);
       const icon = document.createTextNode('[+]');
       iconElement.appendChild(icon);
    }

    /*
    * toggles a css class that overwrites the css rule to expand the max height exposing the answers
    */
    private _accordionEventHandler(id: number):void {
        const faqElement = document.querySelector('.faq-' + id);
        const faqExpandIcon = faqElement.querySelector('.' + this._accordionClassNames.expandIcon);
        const faqExpander = faqElement.querySelector('.' + this._accordionClassNames.expander);

        faqExpandIcon.addEventListener('click', () =>  {
            faqExpander.classList.toggle(this._accordionClassNames.expanded);
        }, false);
    }
}

interface IAccordionObject {
    faqs: [IFaq];
    info: IResponse;
}

interface IFaq {
    id: number;
    question: string;
    answer: string;
}

interface IResponse {
    responseCode: number;
    responseMessage: string;
}

interface IAccordionClassNames {
    accordion: string;
    header: string;
    expander: string;
    expanded: string;
    expandIcon: string;
    question: string;
    answer: string;
}