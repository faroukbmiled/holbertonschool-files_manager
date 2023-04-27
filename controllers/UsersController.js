const sha1 = require('sha1');
const DBClient = require('../utils/db');
const { ObjectId } = require('mongodb');

class UsersController {
  static async postNew(req, res) {
    const { email, password } = req.body;
    if (!email) return res.status(400).send({ error: 'Missing email' });
    if (!password) return res.status(400).send({ error: 'Missing password' });

    const dbClient = DBClient.getInstance();
    const users = dbClient.db.collection('users');
    const user = await users.findOne({ email });
    if (user) return res.status(400).send({ error: 'Already exist' });

    const newUser = await users.insertOne({
      email,
      password: sha1(password),
    });
    const { _id } = newUser.ops[0];
    return res.status(201).send({ email, _id: ObjectId(_id).toString() });
  }
}

module.exports = UsersController;
