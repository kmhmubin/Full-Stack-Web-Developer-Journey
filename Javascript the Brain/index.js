// pet class with a name, age  and eath method
class Pet {
  constructor(name, age) {
    console.log(`Pet constructor called`);
    this.name = name;
    this.age = age;
  }
  eat() {
    return `${this.name} is eating`;
  }
}

class Cat extends Pet {
  constructor(name, age, livesLeft = 9) {
    console.log(`Cat constructor called`);
    super(name, age);
    this.livesLeft = livesLeft;
  }
  meow() {
    return "MEOWWWWWW!!";
  }
}

// dog class extending the Pet class
class Dog extends Pet {
  bark() {
    return "WOOF!!!";
  }
  eat() {
    return `${this.name} scrafs his food!`;
  }
}
