import { User } from 'typegram';

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

const getChatCollections = async (chat_id: number): Promise<string[]> => {
  const cursor = await db.listCollections({ name: new RegExp(`^${chat_id}`) }, true);
  const collections: string[] = [];
  while (await cursor.hasNext()) {
    collections.push((await cursor.next()).name);
  }
  return collections;
};

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

const addOrUpdateUser = async (user: User, chat_id: number): Promise<string> => {
  const collection = db.collection(chat_id.toString());
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

const deleteUser = async (user: User, chat_id: number): Promise<string> => {
  try {
    const collections: string[] = await getChatCollections(chat_id);
    for (const collectionName of collections) {
      const collection = db.collection(collectionName);
      if (await collection.find({ id: user.id })
        .count() !== 0) {
        await collection.deleteOne({ id: user.id });
      } else if (!collectionName.includes('_')) return unregisterReplyCodes.NOT_REGISTERED;
    }
    return unregisterReplyCodes.DELETED;
  } catch (err) {
    return unregisterReplyCodes.ERROR;
  }
};

const getAllUsernames = async (chat_id: number): Promise<string[] | string> => {
  const collection = db.collection(chat_id.toString());
  const usernames: string[] = [];
  const cursor = await collection.find();

  if (!(await cursor.hasNext())) return showReplyCodes.NO_USERS_FOUND;

  while (await cursor.hasNext()) {
    usernames.push((await cursor.next()).username);
  }

  return usernames;
};

const addUserIdToRole = async (user: User, collection_name: string, chat_id: number): Promise<string> => {
  const collection = db.collection(`${chat_id}_${collection_name}`);
  const cursor = await collection.find({ id: user.id });
  if ((await cursor.count()) === 0) {
    await collection.insertOne({ id: user.id });
    return joinReplyCodes.ADDED;
  }
  return joinReplyCodes.ALREADY_REGISTERED;
};

const removeUserFromRole = async (user: User, collection_name: string, chat_id: number): Promise<string> => {
  let collection;
  try {
    collection = db.collection(`${chat_id}_${collection_name}`);
  } catch {
    return leaveReplyCodes.COLLECTION_DOES_NOT_EXIST;
  }

  if (await collection.find({ id: user.id }).count() !== 0) {
    await collection.deleteOne({ id: user.id });
    return leaveReplyCodes.DELETED;
  }
  return leaveReplyCodes.USER_NOT_IN_COLLECTION;
};

const getUserIdsAndUsernamesFromRole = async (collection_name: string, chat_id: number): Promise<string | Object> => {
  let roleCollection;
  try {
    roleCollection = db.collection(`${chat_id}_${collection_name}`);
  } catch {
    return getRoleReplyCodes.COLLECTION_DOES_NOT_EXIST;
  }
  const cursor = await roleCollection.find();
  if ((await cursor.count()) === 0) {
    return getRoleReplyCodes.COLLECTION_EMPTY;
  }

  const ids: string[] = [];
  while (await cursor.hasNext()) {
    ids.push((await cursor.next()).id);
  }

  const usersCollection = db.collection(chat_id.toString());
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
