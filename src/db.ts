import {
  registerReplyCodes,
  unregisterReplyCodes,
  showReplyCodes,
  joinReplyCodes,
  leaveReplyCodes,
} from './reply_codes';

const { MongoClient } = require('mongodb');

const url = `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/`;
let client;
let db;

const connect = async () => {
  try {
    client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
    db = client.db(process.env.MONGO_DB_NAME);
  } catch (err) {
    throw new Error(`DB connection error: ${err}`);
  }
};

const closeConnection = async () => {
  try {
    await client.close();
  } catch (err) {
    throw new Error('DB connection closure fail');
  }
};

const addOrUpdateUser = async (user) => {
  const collection = db.collection('users');
  const cursor = await collection.find({ id: user.id });
  if ((await cursor.count()) === 0) {
    await collection.insertOne(user);
    return registerReplyCodes.ADDED;
  }
  if ((await cursor.next()).username !== user.username) {
    await collection.updateOne({ id: user.id }, { $set: { username: user.username } });
    return registerReplyCodes.UPDATED;
  }
  return registerReplyCodes.ALREADY_REGISTERED;
};

const deleteUser = async (user) => {
  const collection = db.collection('users');
  if (await collection.find({ id: user.id }).count() !== 0) {
    await collection.deleteOne({ id: user.id });
    return unregisterReplyCodes.DELETED;
  }
  return unregisterReplyCodes.ERROR;
};

const getAllUsers = async (): Promise<string[] | string> => {
  const collection = db.collection('users');
  const usernames = [];
  const cursor = await collection.find();

  if (!(await cursor.hasNext())) return showReplyCodes.NO_USERS_FOUND;

  while (await cursor.hasNext()) {
    usernames.push((await cursor.next()).username);
  }

  return usernames;
};

const addUserIdToRole = async (user, collection_name) => {
  const collection = db.collection(collection_name);
  const cursor = await collection.find({ id: user.id });
  if ((await cursor.count()) === 0) {
    await collection.insertOne({ id: user.id });
    return joinReplyCodes.ADDED;
  }
  return joinReplyCodes.ALREADY_REGISTERED;
};

const removeUserFromRole = async (user, collection_name) => {
  let collection;
  try {
    collection = db.collection(collection_name);
  } catch {
    return leaveReplyCodes.COLLECTION_DOES_NOT_EXIST;
  }

  if (await collection.find({ id: user.id }).count() !== 0) {
    await collection.deleteOne({ id: user.id });
    return leaveReplyCodes.DELETED;
  }
  return leaveReplyCodes.ERROR;
};

export {
  addOrUpdateUser,
  deleteUser,
  getAllUsers,
  addUserIdToRole,
  removeUserFromRole,
  connect,
  closeConnection,
};
