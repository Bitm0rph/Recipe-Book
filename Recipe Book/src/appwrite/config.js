import conf from '../Conf/conf.js';
import { Client, ID, Databases, Storage, Query, Permission, Role } from "appwrite";

export class Service{
    client = new Client();
    databases;
    bucket;

    constructor(){
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        this.databases = new Databases(this.client);
        this.bucket = new Storage(this.client);
    }

    async getPost(id){
        try {
            return await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                id
            )
        } catch (error) {
            console.log("Appwrite Service :: getPost :: error", error);
            return false
        }
    }


    async getPosts(){
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
            )
        } catch (error) {
            console.log("Appwrite Service :: getPosts :: error", error);
            return false
        }
    }
    
    async getFavorites(userId) {
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteFavCollectionId,
                [
                    Query.equal('userId', userId)
                ]
            )
        } catch (error) {
            console.log("Appwrite Service :: getFavorites :: error", error);
            return false
        }
    }
    
    async getSelectedRecipes(category) {
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                [
                    Query.contains('Category', category)
                ]
            )
        } catch (error) {
            console.log("Appwrite Service :: getSelectedRecipes :: error", error);
            return false
        }
    }
    
    async getCategory(id) {
        try {
            return await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCatCollectionId,
                id
            )
        } catch (error) {
            console.log("Appwrite Service :: getCategories :: error", error);
            return false
        }
    }
    
    async getCategories() {
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCatCollectionId,
                []
            )
        } catch (error) {
            console.log("Appwrite Service :: getCategories :: error", error);
            return false
        }
    }

    async addFavorite(userId,recipeId) {
        try {
            return await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteFavCollectionId,
                ID.unique(),
                { userId, recipeId },
                [
                    Permission.read(Role.user(userId)),
                    Permission.write(Role.user(userId)),
                ]
            );
        } catch (error) {
            console.log("Appwrite Service :: addFavorite :: error", error);
            return false
        }
    }
    async removeFavorite(favDocId) {
        try {
          return await this.databases.deleteDocument(
            conf.appwriteDatabaseId,
            conf.appwriteFavCollectionId,
            favDocId
          );
        } catch (error) {
          console.error("Appwrite Service :: removeFavorite :: error", error);
          throw error;
        }
      }
}


const service = new Service()
export default service