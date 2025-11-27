const fs = require('fs');
const convert = require('xml-js');
const protobuf = require('protobufjs');

// Charger la définition Protobuf depuis employee.proto
const root = protobuf.loadSync('employee.proto');
const EmployeeList = root.lookupType('Employees');

const employees = [];

employees.push({
  id: 1,
  name: 'Ali',
  salary: 9000,
  email: 'ali@example.com',
  hire_date: '2023-01-10',
  active: true
});
employees.push({
  id: 1,
  name: 'houda',
  salary: 9000,
  email: 'houda@example.com',
  hire_date: '2023-01-10',
  active: true
});

const jsonObject = { employee: employees };

// Options pour XML
const xmlOptions = { compact: true, ignoreComment: true, spaces: 2 };

// ---------- JSON ----------
console.time('JSON encode');
const jsonData = JSON.stringify(jsonObject, null, 2);
console.timeEnd('JSON encode');

console.time('JSON decode');
const jsonDecoded = JSON.parse(jsonData);
console.timeEnd('JSON decode');

// ---------- XML ----------
console.time('XML encode');
const xmlData = "<root>\n" + convert.json2xml(jsonObject, xmlOptions) + "\n</root>";
console.timeEnd('XML encode');

console.time('XML decode');
const xmlJson = convert.xml2json(xmlData, { compact: true });
const xmlDecoded = JSON.parse(xmlJson);
console.timeEnd('XML decode');

// ---------- Protobuf ----------
console.time('Protobuf encode');
const errMsg = EmployeeList.verify(jsonObject);
if (errMsg) throw Error('Erreur de validation Protobuf : ' + errMsg);
const message = EmployeeList.create(jsonObject);
const buffer = EmployeeList.encode(message).finish();
console.timeEnd('Protobuf encode');

console.time('Protobuf decode');
const decodedMessage = EmployeeList.decode(buffer);
const protoDecoded = EmployeeList.toObject(decodedMessage);
console.timeEnd('Protobuf decode');

// ---------- Écriture des fichiers ----------
fs.writeFileSync('data.json', jsonData);
fs.writeFileSync('data.xml', xmlData);
fs.writeFileSync('data.proto', buffer);

// ---------- Taille des fichiers ----------
const jsonFileSize = fs.statSync('data.json').size;
const xmlFileSize = fs.statSync('data.xml').size;
const protoFileSize = fs.statSync('data.proto').size;

console.log(`Taille de 'data.json' : ${jsonFileSize} octets`);
console.log(`Taille de 'data.xml'  : ${xmlFileSize} octets`);
console.log(`Taille de 'data.proto': ${protoFileSize} octets`);