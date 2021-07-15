import { User } from 'typegram';
import {
  Collection, Cursor, Db,
} from 'mongodb';

import {
  joinReplyCodes,
  leaveReplyCodes,
  getRoleReplyCodes,
} from './reply_codes';

const { MongoClient } = require('mongodb');

const url: string = `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/`;
let client: typeof MongoClient;
let db: Db;

const connectDB = async (): Promise<void> => {
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

const saveOrUpdateUser = async (user: User): Promise<void> => {
  const collection: Collection = db.collection('users');
  const cursor: Cursor = collection.find({ id: user.id });
  if (await cursor.count() !== 0) await collection.updateOne({ id: user.id }, { $set: user });
  else await collection.insertOne(user);
};

const addUserIdToRole = async (user: User, roleName: string, chatId: number): Promise<string> => {
  const collection: Collection = db.collection(String(chatId));
  const cursor: Cursor = await collection.find({ role: roleName });
  if ((await cursor.count()) === 0) {
    await collection.insertOne({ role: roleName, ids: [user.id] });
    return joinReplyCodes.ADDED;
  }
  const roleIds: number[] = (await cursor.next()).ids;
  if (roleIds.includes(user.id)) return joinReplyCodes.ALREADY_REGISTERED;

  roleIds.push(user.id);
  await collection.updateOne({ role: roleName }, { $set: { ids: roleIds } });
  return joinReplyCodes.ADDED;
};

const removeUserFromRole = async (user: User, roleName: string, chatId: number): Promise<string> => {
  let collection: Collection;
  try {
    collection = db.collection(String(chatId));
  } catch {
    return leaveReplyCodes.ROLE_DOES_NOT_EXIST;
  }

  const cursor: Cursor = await collection.find({ role: roleName });
  if (await cursor.count() === 0) return leaveReplyCodes.ROLE_DOES_NOT_EXIST;

  const roleIds: number[] = (await cursor.next()).ids;
  const userIdIdx: number = roleIds.indexOf(user.id);
  if (userIdIdx !== -1) {
    roleIds.splice(userIdIdx, 1);
    await collection.updateOne({ role: roleName }, { $set: { ids: roleIds } });
    return leaveReplyCodes.DELETED;
  }
  return leaveReplyCodes.USER_NOT_IN_COLLECTION;
};

const getUserIdsAndUsernamesFromRole = async (roleName: string, chatId: number): Promise<string | Object> => {
  let collection: Collection;
  try {
    collection = db.collection(String(chatId));
  } catch {
    return getRoleReplyCodes.ROLE_DOES_NOT_EXIST;
  }

  const cursor: Cursor = await collection.find({ role: roleName });
  if ((await cursor.count()) === 0) {
    return getRoleReplyCodes.ROLE_DOES_NOT_EXIST;
  }

  const { ids } = await cursor.next();

  const usersCollection: Collection = db.collection('users');
  const idsAndUsernames: Object = {};
  for (const value of ids) {
    idsAndUsernames[value] = (await (await usersCollection.find({ id: value })).next()).username;
  }

  if (Object.keys(idsAndUsernames).length === 0) return getRoleReplyCodes.COLLECTION_EMPTY;

  return idsAndUsernames;
};

const getChatRoles = async (chatId: number, userId: number, doesUserHaveIt: boolean): Promise<string[]> => {
  let collection: Collection;
  try {
    collection = db.collection(String(chatId));
  } catch {
    return [];
  }

  const rolesCursor: Cursor = await collection.find({});
  const roles: string[] = [];
  while (await rolesCursor.hasNext()) {
    const roleObject = await rolesCursor.next();
    const roleUserIds: number[] = roleObject.ids;

    let flag = false;
    for (const id of roleUserIds) {
      if (id === userId) flag = true;
    }
    if (flag !== doesUserHaveIt) continue;

    roles.push(roleObject.role);
  }
  return roles;
};

export {
  saveOrUpdateUser,
  addUserIdToRole,
  removeUserFromRole,
  connectDB,
  closeConnection,
  getUserIdsAndUsernamesFromRole,
  getChatRoles,
};
