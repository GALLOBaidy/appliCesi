"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserByLogin = exports.deleteUser = exports.updateUser = exports.getUserById = exports.getAllUsers = exports.createUser = void 0;
const bcrypt = __importStar(require("bcrypt"));
const models_1 = require("../models");
const user_model_1 = require("../models/schema/user.model");
const drizzle_orm_1 = require("drizzle-orm");
//Création d'un user
const createUser = async (data) => {
    // Hash du mot de passe
    const hash = await bcrypt.hash(data.password, 10);
    //Convertir brithDay en vraie date JS
    const birthDay = data.birthDay ? new Date(data.birthDay) : null;
    console.log("birth reçu :", data.birthDay, "->après conversion :", birthDay);
    // Insertion flexible : on ne met que ce qui existe
    try {
        const result = await models_1.db
            .insert(user_model_1.users)
            .values({
            ...data,
            birthDay,
            login: data.login,
            password: hash,
            registrationDate: new Date(),
        })
            .returning();
        return result[0];
    }
    catch (error) {
        console.error("🔥 Error during user creation:", error);
        throw error;
    }
};
exports.createUser = createUser;
//Récupérer tous les users
const getAllUsers = async () => {
    const result = await models_1.db.select().from(user_model_1.users);
    return result.map(({ password, ...user }) => user); // Exclure les mots de passe
};
exports.getAllUsers = getAllUsers;
//Récupérer 1 user
const getUserById = async (id) => {
    const result = await models_1.db.select().from(user_model_1.users).where((0, drizzle_orm_1.eq)(user_model_1.users.userId, id));
    if (!result[0])
        return null;
    const { password, ...user } = result[0]; // Exclure le mot de passe
    return user;
};
exports.getUserById = getUserById;
//Modifier des données
const updateUser = async (id, data) => {
    //Vérifier si le user existe
    const existingUser = await (0, exports.getUserById)(id);
    if (!existingUser)
        return null;
    const updateData = { ...data };
    //Empêcher la modification de la date de d'inscription
    delete updateData.registrationDate;
    // Re-hash si password fourni
    if (data.password) {
        updateData.password = await bcrypt.hash(data.password, 10);
    }
    const result = await models_1.db
        .update(user_model_1.users)
        .set(updateData)
        .where((0, drizzle_orm_1.eq)(user_model_1.users.userId, id))
        .returning();
    return result[0] ?? null;
};
exports.updateUser = updateUser;
//Supprimer un user
const deleteUser = async (id) => {
    //Vérifier si le user existe
    const existingUser = await (0, exports.getUserById)(id);
    if (!existingUser)
        return null;
    const result = await models_1.db.delete(user_model_1.users).where((0, drizzle_orm_1.eq)(user_model_1.users.userId, id)).returning();
    return result[0] ?? null;
};
exports.deleteUser = deleteUser;
//Récupérer un user par son login (pour l'authentification)
const getUserByLogin = async (login) => {
    const result = await models_1.db.select().from(user_model_1.users).where((0, drizzle_orm_1.eq)(user_model_1.users.login, login));
    return result[0] || null;
};
exports.getUserByLogin = getUserByLogin;
