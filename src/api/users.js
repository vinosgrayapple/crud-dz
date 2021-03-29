const express = require('express');
const axios = require('axios');
const {
  readFile, writeFile, stat, unlink
} = require('fs').promises;

const router = express.Router();
const pathToFile = `${__dirname}/users.json`;
async function readUsersFile() {
  try {
    const text = await readFile(pathToFile, { encoding: 'utf8' });
    return text;
  } catch (error) {
    return Error('Error in funcion readUsersFile');
  }
}
async function writeUsersFile(text) {
  try {
    await writeFile(pathToFile, JSON.stringify(text), { encoding: 'utf8' });
    return;
  } catch (error) {
    return new Error('Error in funcion writeUsersFile');
  }
}
const getData = async (url) => {
  const result = await axios(url).then(({ data }) => data);
  return result;
};
/* get /api/v1/users - получает всех юзеров из файла users.json,
если его нет - получает данные с
сервиса https://jsonplaceholder.typicode.com/users,
заполняет файл users.json полученными данными
 и возвращает эти данные пользователю. */
router.get('/', async (req, res) => {
  stat(pathToFile)
    .then(async () => {
      const data = await readUsersFile();
      res.send(JSON.parse(data));
    })
    .catch(async () => {
      try {
        const data = await getData('https://jsonplaceholder.typicode.com/users');
        await writeUsersFile(data);
        res.json(data);
      } catch (error) {
        res.status(500).send({ message: error.message });
      }
    });
});
/* post /api/v1/users - добавляет юзера в файл users.json,
с id равным id последнего элемента + 1
и возвращает { status: 'success', id: id } */
router.post('/', async (req, res) => {
  const {
    name, username, email, address, phone, website
  } = req.body;
  const newUser = {
    name, username, email, address, phone, website
  };
  const data = await readUsersFile();
  const users = JSON.parse(data);
  const maxId = users.reduce((a, b) => (+b.id > a ? +b.id : a), 0);
  newUser.id = maxId + 1;
  users.push(newUser);
  await writeUsersFile(users);
  res.json({ status: 'success', id: newUser.id });
});
module.exports = router;
/*
  "name": "Leanne Graham",
    "username": "Bret",
    "email": "Sincere@april.biz",
    "address": {
      "street": "Kulas Light",
      "suite": "Apt. 556",
      "city": "Gwenborough",
      "zipcode": "92998-3874",
      "geo": {
        "lat": "-37.3159",
        "lng": "81.1496"
      }
    },
    "phone": "1-770-736-8031 x56442",
    "website": "hildegard.org",
    "company": {
      "name": "Romaguera-Crona",
      "catchPhrase": "Multi-layered client-server neural-net",
      "bs": "harness real-time e-markets"
    }

*/
