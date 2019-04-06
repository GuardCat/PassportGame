/*  Создаёт экземпляр следящего за текстовым полем класса Mask 
    Только для полей с наличием value.
    
    Добавляет методы на события keypress и keydown, чтобы отслеживать и символы и горячие клавиши (например, backspace).
    
    Для каждой нажатой буквы проверяет совпадение с соответствующим элементом шаблона. Не введённые символы или несовпадающие с шаблоном, отображает
    в поле ввода как "_" для символов, для разделителя (string элемент) выводит сам разделитель.

    @constructor
    @todo корректная обработка вставки текста. Например, разбор по одному символу и передача методу "add"
*/

class Mask{

    /*
        @param el {HTML Elementh}
        @param template {Array}
        
        В принимаемом массиве ожидаются RegExp для символов и String для разделителей. Каждый элемент — один символ. Для многосимвольных 
        разделителей, вводим несколько элементов массива.
    */
    constructor(el, template) {
        if (!(template instanceof Array) || template.length === 0) throw new Error("Wrong template for Mask instance");
        this.template = template;
        this.result = "";
        this.text = "";
        this.el = el;
        this.makeResult();
        
        el.addEventListener("keypress", this.change.bind(this), false);
        el.addEventListener("keydown", this.operation.bind(this), true);
    }
    
    add(letter) {
        if (this.text.length >= this.template.length) return false;
        if (!letter || !letter instanceof String) return false;
        let txtln = this.text.length, template = this.template[txtln];
        
        if (template instanceof RegExp) {
            this.text += template.test(letter) ? letter : "";
        } else if (letter === template) {
            this.text += letter;
        } else {
            for(let i = txtln; i < this.template.length; i++) {
                if (this.template[i] instanceof RegExp) {
                    this.text += this.template[i].test(letter) ? letter : "";
                    break;
                } else {
                    this.text += this.template[i];
                }
            }
        }
        this.makeResult();
    }
    
    del() {
        do {
            if (this.text.length <= 0) break;
            this.text = this.text.slice(0,-1);
        } while ( !(this.template[this.text.length - 1] instanceof RegExp) );
        this.makeResult();
    }
    
    clear() {
        this.text = "";
        this.makeResult();
    }
    
    makeResult() {
        let txtln = this.text.length, tmpln = this.template.length;
        if (tmpln < txtln) return false;
        this.result = "";
        for(let i = 0; i < tmpln; i++) {
            if (txtln > i) {
                this.result += this.text[i];
            } else {
                this.result += this.template[i] instanceof RegExp ? "_" : this.template[i];
            }
        }
        this.el.value = this.result;
        this.el.setSelectionRange(this.text.length, this.text.length)
    }
    
    change(e) {
        e.preventDefault();
        if (e.charCode > 31) {
            this.add( String.fromCharCode(e.charCode) );
        }

    }
    
   operation(e) {
        switch (e.keyCode) {
            case 8:
                this.del();
                e.preventDefault();
            break;
            case 9:
                let 
                    tabIndex = +e.target.tabIndex,
                    targetElement = document.querySelector(`input[tabindex='${++tabIndex}']`)
                ;
                targetElement = targetElement || document.querySelector(`input[tabindex='1']`);
                targetElement ? targetElement.focus() : false;
                e.preventDefault();
            break;
            case 116:
                window.location.reload();
                e.preventDefault();
            break;
        }
        return true;
   }
}


