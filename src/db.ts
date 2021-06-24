const MongoClient = require("mongodb").MongoClient;

import {
    register_reply_codes,
    unregister_reply_codes,
    show_reply_codes,
    join_reply_codes,
    leave_reply_codes
} from "./reply_codes";

const url = `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/`;
let client;
let db;


const connect = async () => {
    try {
        client = await MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});
        db = client.db(process.env.MONGO_DB_NAME);
    } catch (err) {
        throw new Error(`DB connection error: ${err}`);
    }
}

const close_connection = async () => {
    try {
        await client.close();
    } catch (err) {
        throw new Error("DB connection closure fail");
    }
}


const add_or_update_user = async (user) => {
    const collection = db.collection("users");
    const cursor = await collection.find({"id": user.id});
    if ((await cursor.count()) === 0) {
        await collection.insertOne(user);
        return register_reply_codes.ADDED;
    }
    if ((await cursor.next()).username !== user.username) {
        await collection.updateOne({"id": user.id}, {$set: {"username": user.username}});
        return register_reply_codes.UPDATED;
    }
    return register_reply_codes.ALREADY_REGISTERED;
}

const delete_user = async (user) => {
    const collection = db.collection("users");
    if (await collection.find({"id": user.id}).count() !== 0) {
        await collection.deleteOne({"id": user.id});
        return unregister_reply_codes.DELETED;
    } else {
        return unregister_reply_codes.ERROR;
    }
}

const get_all_users = async function (): Promise<string[] | string> {
    const collection = db.collection("users");
    let usernames = [];
    const cursor = await collection.find();

    if (!(await cursor.hasNext())) return show_reply_codes.NO_USERS_FOUND;

    while (await cursor.hasNext()) {
        usernames.push((await cursor.next()).username);
    }

    return usernames;
}


const add_user_id_to_role = async (user, collection_name) => {
    const collection = db.collection(collection_name);
    const cursor = await collection.find({"id": user.id});
    if ((await cursor.count()) === 0) {
        await collection.insertOne({"id": user.id});
        return join_reply_codes.ADDED;
    }
    return join_reply_codes.ALREADY_REGISTERED;
}

const remove_user_from_role = async (user, collection_name) => {
    let collection;
    try{
        collection = db.collection(collection_name);
    } catch {
        return leave_reply_codes.COLLECTION_DOES_NOT_EXIST;
    }

    if (await collection.find({"id": user.id}).count() !== 0) {
        await collection.deleteOne({"id": user.id});
        return leave_reply_codes.DELETED;
    } else {
        return leave_reply_codes.ERROR;
    }
}


export {
    add_or_update_user,
    delete_user,
    get_all_users,
    add_user_id_to_role,
    remove_user_from_role,
    connect,
    close_connection
};