// src/appwrite/Auth.js
import { account } from '../appwrite';

export default {
  login: async ({ email, password }) => {
    // creates an email+password session
    return account.createEmailSession(email, password);
  },
  signup: async ({ email, password }) => {
    // creates user + session
    await account.create('unique()', email, password);
    return account.createEmailSession(email, password);
  },
  getCurrentUser: () => {
    return account.get();
  },
  logout: () => {
    return account.deleteSession('current');
  }
};
