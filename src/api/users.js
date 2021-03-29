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
    throw Error('Error in funcion writeUsersFile');
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
      res.json(data);
    })
    .catch(async () => {
      try {
        const data = await getData('https://jsonplaceholder.typicode.com/users');
        await writeUsersFile(data);
        res.json(JSON.parse(data));
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
  const users = await readUsersFile();
  const maxId = users.reduce((a, b) => (+b.id > a ? +b.id : a), 0);
  newUser.id = maxId + 1;
  users.push(newUser);
  await writeUsersFile(users);
  res.json({ status: 'success', id: newUser.id });
});
/*
patch /api/v1/users/:userId
 - получает новый объект, дополняет его
 полями юзера в users.json, с id равным userId,
 и возвращает
 { status: 'success', id: userId }
*/
router.patch('/:userId', async (req, res) => {
  const { userId } = req.params;
  const users = await readUsersFile();
  const newUsers = users.map((u) => (u.id !== userId ? u : ({ ...u, ...req.body })));
  await writeUsersFile(newUsers);
  res.json({ status: 'success', id: userId });
});
/*
delete /api/v1/users/:userId
 - удаляет юзера в users.json,
  с id равным userId,
  и возвращает { status: 'success', id: userId }
*/
router.delete('/:userId', async (req, res) => {
  const { userId } = req.params;
  const users = await readUsersFile();
  const newUsers = users.filter((u) => u.id !== userId);
  await writeUsersFile(newUsers);
  res.json({ status: 'success', id: userId });
});
/* delete /api/v1/users - удаляет файл users.json */
router.delete('/', async (req, res) => {
  await unlink(pathToFile);
  res.status(200).json({ status: 'ok' });
});
module.exports = router;
