const fs = require('fs');
const Database = require("@replit/database");
const db = new Database();

class Person {
  name = "";
  age = 0;
  attends = "";
  bio = "";

  constructor(name, age, attends, bio) {
    this.name = name;
    this.age = age;
    this.attends = attends;
    this.bio = bio;
  }

  introduction() {
    let legalDrinkingAge = this.age >= 21;
    let drinkingAgeStatus = legalDrinkingAge ? "Yes" : "No";
    return `Hi, I am ${this.name} and I am ${this.age} and I attend ${this.attends}. Bio: ${this.bio} Legal Drinking Age: ${drinkingAgeStatus}`;
  }
}

fs.readFile('person.txt', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }

  const lines = data.split('\n');
  const info = {};

  for (const line of lines) {
    const [key, value] = line.split(': ');
    info[key] = value;
  }

  const person = new Person(info['Name'], info['Age'], info['Attends'], info['Bio']);

  // Commit the person to the Replit Database
  db.set('person'+person.Name, person).then(() => {
    console.log('Student has been committed to the database.');

    // Load all people from the database and print their introductions
    db.list().then(async keys => {
      for (const key of keys) {
        const person = await db.get(key);
        if (person) {
          const personObj = new Person(person.name, person.age, person.attends, person.bio);
          console.log(personObj.introduction());
        }
      }
    });
  });
});
