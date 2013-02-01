//Constructor
function CustomSelect(id, containerId) {
    var id = id || '',
        select = document.getElementById(id),
        name = (select && select.name) ? select.name : '',
        value = null,
        container = null,
        containerId = containerId || null,
        list = new CustomList(select),
        hiddenInput = null,
        textInput = null,
        ulHint = null,
        ul = null,
        idPrefix = name + '_',
        statusShow = false
    ;

    /**
     * Draw method
     */
    this.draw = function() {
        this.drawConteiner();
        container = this.getContainer();
        hiddenInput = this.createEl(
            'input',
            {
                'type': 'hidden',
                'value': value,
                'name': name
            }
        );
        textInput = this.createEl(
            'input',
            {
                'type': 'text',
                'autocomplete': 'off'
            }
        );

        ulHint = this.getUlHint(list.getElements());
        ul = ulHint.firstChild;

        container.appendChild(hiddenInput);
        container.appendChild(textInput);
        container.appendChild(ulHint);
        select.parentNode.removeChild(select);
        this.addEvent();
    }

    /**
     * Draw main div
     */
    this.drawConteiner = function() {
        var div = this.createEl(
            'div',
            {'id': 'boxId_'+ name}
        );
        div.setAttribute('class','customSelect');
        document.write(div.outerHTML);
    }

    /**
     * Get main div
     *
     * @return {HTMLElement}
     */
    this.getContainer = function() {
        return document.getElementById('boxId_'+ name);
    }

    /**
     * Get and create div with ul
     *
     * @param Array options
     * @return {HTMLElement}
     */
    this.getUlHint = function(options) {
        var div = this.createEl('div');
        var ul = this.createEl('ul');
        var self = this;

        for (var i = 0;i < options.length; i++) {
            var option = options[i];
            var li = this.createEl('li', {
                'id': idPrefix + option['value']
            })
            li.innerHTML = option['text'];

            li.addEventListener('click', function(event) {
                self.liClick(this);
            });
            ul.appendChild(li);
        }

        div.appendChild(ul);
        return ulHint = div;
    }

    /**
     * Create elements method
     *
     * @param string type node
     * @param array options
     * @return {HTMLElement}
     */
    this.createEl = function(node, options) {
        var el = document.createElement(node);
        for (var key in options) {
            el.setAttribute(key, options[key]);
        }
        return el
    }

    /**
     * Set events
     */
    this.addEvent = function() {
        var self = this;
        document.body.addEventListener('click', function(event) {
            if (self.getStatusShow() && event.target != textInput) {
                self.hideElements();
            }
        });
        textInput.addEventListener('keydown', function(event) {
            switch (event.keyCode) {
                case 38:
                    var el = list.prewElement();
                    break;
                case 40:
                    var el = list.nextElement();
                    break;
                case 13:
                    var selectedLi = self.getSelected() ? self.getSelected() : '';
                    if (selectedLi == '') {
                        break;
                    }
                    self.setValue(selectedLi);
                    self.hideElements();
                    return false;
            }
            if (event.keyCode == 38 || event.keyCode == 40) {
                self.removeSelected();
                self.setSelected(el);
            }
            self.setScroll();
        });

        textInput.addEventListener('keyup', function(event) {
            if (event.keyCode != 13) {
                self.processingAll();
            } else {
                self.hideElements();
            }
        });

        textInput.addEventListener('click', function(event) {
            self.processingAll();
        });
    }

    /**
     * Get status
     *
     * @return {Boolean}
     */
    this.getStatusShow = function() {
        return statusShow;
    }

    /**
     * Set status
     *
     * @param boolean flag
     * @return boolean
     */
    this.setStatusShow = function(flag) {
        return (typeof flag == 'boolean')
            ? statusShow = flag
            : false
        ;
    }

    /**
     * Find and show method
     */
    this.processingAll = function() {
        var val = textInput.value;
        var a = val.split('.');
        if (a.length > 1) {
            val = a.join('\\.')
        }
        var reg = new RegExp(val, 'i');//'^' +
        list.setElements(list.findForRegExp(reg));
        this.showElements();
    }

    /**
     * Show elements method
     */
    this.showElements = function() {
        statusShow = true;
        ul.setAttribute('class', 'hide');
        var elements = list.getElements();
        if (elements.length > 0) {
            ulHint.style.display = 'block';
            ul.style.display = 'block';
            for (var i=0; i < ul.childNodes.length; i++) {
                if (ul.childNodes[i]) {
                    ul.childNodes[i].style.display = 'none';
                }
            }
            for (var i = 0; i < elements.length; i++ ) {
                var id = idPrefix + elements[i].value;
                document.getElementById(id).style.display = 'block';
            }
        } else {
            this.hideElements();
        }
    }

    /**
     * Set scroll position
     */
    this.setScroll = function() {
        if (list.activeEl != null) {
            var scroll = this.scrollPosition();
            var element = list.activePosition();
            if (scroll.top > element.top) {
                ulHint.scrollTop = element.top;
            } else if (scroll.bottom < element.bottom) {
                var top = element.bottom - scroll.height;
                ulHint.scrollTop = top;
            }
        }
    }

    /**
     * Define scroll position
     *
     * @return {Object}
     */
    this.scrollPosition = function () {
        var height = ulHint.clientHeight;
        return {
            top: ulHint.scrollTop,
            bottom: ulHint.scrollTop + height,
            height: height
        }
    }

    /**
     * Remove class 'selected'
     */
    this.removeSelected = function() {
        for (var i = 0; i < ul.childNodes.length; i++) {
            var el = ul.childNodes[i];
            if (el.hasAttribute('class', 'selected')) {
                el.removeAttribute('class');
                break;
            }
        }
    }

    /**
     * Set 'selected' class element
     *
     * @param {HTMLElement}
     */
    this.setSelected = function(el) {
        el.setAttribute('class', 'selected');
    }

    /**
     * Get element with class 'selected'
     *
     * @return {HTMLElement}
     */
    this.getSelected = function() {
        return (document.getElementsByClassName)
            ? ul.getElementsByClassName('selected')[0]
            : this.getSelectedEl()
        ;
    }

    /**
     * Get element with class 'selected' for old browsers
     *
     * @return {HTMLElement}
     */
    this.getSelectedEl = function() {
        var result = null;
        for (var i = 0; i < ul.childNodes.length; i++) {
            if (list[i].className.search('selected') != -1) {
                result = list[i];
                break;
            }
            return result[0]
        }
    }

    /**
     * Redefine selected class element
     *
     * @param {HTMLElement}
     */
    this.reSelectedLi = function(li) {
        this.removeSelected();
        this.setSelected(li);
    }

    /**
     * Set value
     *
     * @param {HTMLElement}
     */
    this.setValue = function(node) {
        var li = node;
        if (typeof li != undefined) {
            this.removeSelected();
            hiddenInput.value = this.getIdfromLi(li);
            textInput.value = node.innerHTML;
        } else {
            hiddenInput.value = '';
            textInput.value = '';
        }
        this.value = textInput.value;
    }

    /**
     * Get element id
     *
     * @param {HTMLElement}
     * @return number
     */
    this.getIdfromLi = function(node) {
        return node.id.split('_')[1];
    }

    /**
     * Hide elements
     */
    this.hideElements = function() {
        statusShow = false;
        ulHint.style.display = 'none';
        ul.style.display = 'none';
    }

    /**
     * Event for li element
     *
     * @param {HTMLElement}
     */
    this.liClick = function (li) {
        this.reSelectedLi(li);
        this.setValue(li);
        this.hideElements();
    }
    this.draw();
}

CustomSelect.prototype = {
    constructor: CustomSelect
}


function CustomList(select) {
    this.idPref = select.name + '_';
    this.activeEl = null;
    this.elements = this.getElementsFromSelect(select);
    this.filtredElements = this.elements;
}

/**
 * Get elements from select
 *
 * @param {HTMLElement}
 * @return {HTMLElement}
 */
CustomList.prototype.getElementsFromSelect = function(select) {
    if (typeof select == 'undefined') {
        return false;
    }
    var options = [];

    for(var i = 0; i < select.childNodes.length; i++) {
        var node = select.childNodes[i];
        if (typeof node.value == 'undefined') {
            continue;
        }
        var option = {
            'value': node.value,
            'text': node.text
        };
        options.push(option);
    }
    return options;
}

/**
 * Get active element
 *
 * @return {HTMLElement}
 */
CustomList.prototype.activeElement = function () {
    var id = (this.filtredElements[this.activeEl])
        ? this.filtredElements[this.activeEl].value
        : this.elements[this.activeEl].value
    ;
    return document.getElementById(this.idPref + id);
}

/**
 * Set next active element
 *
 * @return {HTMLElement}
 */
CustomList.prototype.nextElement = function () {
    if (
        (
            this.activeEl == (this.filtredElements.length - 1)
            || this.activeEl === null
        )
        || this.activeEl > this.filtredElements.length
        ) {
        this.activeEl = 0;
    } else {
        this.activeEl++;
    }
    return this.activeElement();
}

/**
 * Set prev element
 *
 * @return {HTMLElement}
 */
CustomList.prototype.prewElement = function () {
    if (this.activeEl == 0 || this.activeEl === null) {
        this.activeEl = this.filtredElements.length - 1;
    } else {
        this.activeEl--;
    }
    return this.activeElement();
}

/**
 * Refresh filtered elements
 *
 * @param elements
 * @return Object
 */
CustomList.prototype.setElements = function(elements) {
    return this.filtredElements = elements;
}

/**
 * Get filtered elements
 *
 * @return Object
 */
CustomList.prototype.getElements = function() {
    return this.filtredElements;
}

/**
 * Find elements for RegExp test
 *
 * @param RegExp
 * @return {Array}
 */
CustomList.prototype.findForRegExp = function(RegExp) {
    var elementsArray = [];
    for (var i = 0; i < this.elements.length; i++) {
        var text = this.elements[i].text;
        if (RegExp.test(text)) {
            elementsArray.push(this.elements[i]);
        }
    }
    return elementsArray;
}

/**
 * Get active position
 *
 * @return {Object}
 */
CustomList.prototype.activePosition = function () {
    var el = this.activeElement();
    var height = el.clientHeight;
    return {
        top: el.offsetTop,
        bottom: el.offsetTop + height,
        height: height
    }
}