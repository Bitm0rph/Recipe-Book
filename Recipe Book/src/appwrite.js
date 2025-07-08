// src/appwrite.js
import { Client, Account, Databases } from 'appwrite';

const client = new Client()
  .setEndpoint('http://localhost/v1')
  .setProject('686a301f00321dd9cf0b');

export const account   = new Account(client);
// export const databases = new Databases(client);
