import conf from "../Conf/conf";
import { Client, Databases, Storage, ID, Query } from "appwrite";

export class DataService {
    client = new Client();
    databases;
    bucket;

    constructor(){
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId)
        this.databases = new Databases(this.client)
        this.bucket = new Storage(this.client)
    }

}

const authService = new DataService();

export default authService;