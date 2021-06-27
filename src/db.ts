import {
  registerReplyCodes,
  unregisterReplyCodes,
  showReplyCodes,
  joinReplyCodes,
  leaveReplyCodes, getRoleReplyCodes,
} from './reply_codes';

const { MongoClient } = require('mongodb');

const url: string = `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/`;
let client;
let db;

const connect = async (): Promise<void> => {
  try {
    client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
    db = client.db(process.env.MONGO_DB_NAME);
  } catch (err) {
    throw new Error(`DB connection error: ${err}`);
  }
};

const closeConnection = async (): Promise<void> => {
  try {
    await client.close();
  } catch (err) {
    throw new Error('DB connection closure fail');
  }
};

const addOrUpdateUser = async (user): Promise<string> => {
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

const deleteUser = async (user): Promise<string> => {
  const collection = db.collection('users');
  if (await collection.find({ id: user.id }).count() !== 0) {
    await collection.deleteOne({ id: user.id });
    return unregisterReplyCodes.DELETED;
  }
  return unregisterReplyCodes.ERROR;
};

const getAllUsernames = async (): Promise<string[] | string> => {
  const collection = db.collection('users');
  const usernames: string[] = [];
  const cursor = await collection.find();

  if (!(await cursor.hasNext())) return showReplyCodes.NO_USERS_FOUND;

  while (await cursor.hasNext()) {
    usernames.push((await cursor.next()).username);
  }

  return usernames;
};

const addUserIdToRole = async (user, collection_name: string): Promise<string> => {
  const collection = db.collection(collection_name);
  const cursor = await collection.find({ id: user.id });
  if ((await cursor.count()) === 0) {
    await collection.insertOne({ id: user.id });
    return joinReplyCodes.ADDED;
  }
  return joinReplyCodes.ALREADY_REGISTERED;
};

const removeUserFromRole = async (user, collection_name: string): Promise<string> => {
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
  return leaveReplyCodes.USER_NOT_IN_COLLECTION;
};

const getUserIdsAndUsernamesFromRole = async (collection_name: string): Promise<string | Object> => {
  let roleCollection;
  try {
    roleCollection = db.collection(collection_name);
  } catch {
    return getRoleReplyCodes.COLLECTION_DOES_NOT_EXIST;
  }
  const cursor = roleCollection.find();
  if ((await cursor.count() === 0)) {
    return getRoleReplyCodes.COLLECTION_EMPTY;
  }

  const ids: string[] = [];
  while (await cursor.hasNext()) {
    ids.push((await cursor.next()).id);
  }

  const usersCollection = db.collection('users');
  const idsAndUsernames: Object = {};
  for (const value of ids) {
    idsAndUsernames[value] = (await (await usersCollection.find({ id: value })).next()).username;
  }

  return idsAndUsernames;
};

export {
  addOrUpdateUser,
  deleteUser,
  getAllUsernames,
  addUserIdToRole,
  removeUserFromRole,
  connect,
  closeConnection,
  getUserIdsAndUsernamesFromRole,
};
