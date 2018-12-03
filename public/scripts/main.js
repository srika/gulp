/* var name = "admin";

document.write('Hello ' + name + '!'); */


// ES6 syntax
class Person{
    constructor(name){
        this.name = name;
    }

    welcome(){
        if( typeof this.name === 'string'){
            return 'Hello, my name is ' +name+ '!'
        }
        else{
            return 'hello'
        }
    }
}

var per = new Person('Srikanth');
var greetHTML = templates['greetings']({
    message: per.welcome()
})
document.write(greetHTML);