const table = document.querySelector(".table");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const inpVal = document.getElementById("exampleInputEmail1");

let paginationNumber = 10;
let data = [];
let dataLength = 0;

class Person {
  constructor(name, address, email, phoneNumber, birthdate) {
    this.name = name;
    this.address = address;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.birthdate = birthdate;
  }
  getBirthYearAsNumber() {
    return this.birthdate.split("-")[0];
  }
  calculateAge() {
    return new Date().getFullYear() - this.getBirthYearAsNumber();
  }
}

class User extends Person {
  constructor(name, address, email, phoneNumber, birthdate, job, company) {
    super(name, address, email, phoneNumber, birthdate);
    this.job = job;
    this.company = company;
  }
  isRetired() {
    return this.calculateAge() > 65;
  }
}

String.prototype.toCapitalize = function () {
  return this[0].toUpperCase() + this.slice(1);
};

async function fetchData() {
  let response = await fetch("fake_json_data.json");
  let jsonData = await response.json();
  data = jsonData.map((item) => {
    let { name, address, email, phone_number, birthdate, job, company } = item;
    return new User(name, address, email, phone_number, birthdate, job, company);
  });
  dataLength = data.length;
  createTable(data.slice(0, paginationNumber));
  updateButtons();
}

fetchData();

function createTable(data) {
  let code = "<thead>";
  let keysWords = Object.keys(data[0]);
  keysWords.push("age");
  keysWords.push("retired");
  code += keysWords.map((item) => `<th>${item.toCapitalize()}</th>`).join("");
  code += "</thead>";
  code += "<tbody>";
  code += data
    .map(
      (item) => `
    <tr>
      <td>${item.name}</td>
      <td>${item.address}</td>
      <td>${item.email}</td>
      <td>${item.phoneNumber}</td>
      <td>${item.birthdate}</td>
      <td>${item.job}</td>
      <td>${item.company}</td>
      <td>${item.calculateAge()}</td>
      <td>${item.isRetired()}</td>
    </tr>
    `
    )
    .join("");
  code += "</tbody>";
  table.innerHTML = code;
}

function generatePaginationNumber(arg) {
  paginationNumber += arg;
  updateButtons();
  createTable(data.slice(paginationNumber - 10, paginationNumber));
}

function updateButtons() {
  prevBtn.classList.toggle("disabled", paginationNumber <= 10);
  nextBtn.classList.toggle("disabled", paginationNumber >= dataLength);
}

function search() {
  const searchValue = inpVal.value.trim().toLowerCase();
  const filteredData = data.filter(
    (item) =>
      item.name.toLowerCase().includes(searchValue) ||
      item.email.toLowerCase().includes(searchValue)
  );
  createTable(filteredData.slice(0, 10)); // Show the first page of results
  updateButtons();
}
function sortName(){
    data.sort((a,b)=>a.name.localeCompare(b.name))
    createTable(data)
}
function sortAge(){
    console.log(data);
    data.sort((a,b)=>a.calculateAge()-b.calculateAge())
    createTable(data)
}