import endPoint from "../config/endpoints.config";

import { MongoClient, Db } from "mongodb";
import mongoose from "mongoose";

const database = async () => {
  const db = await mongoose.connect(endPoint.mongoString);
  console.log(`Successfully connected to database: ${endPoint.mongoName}`.blue);
};
export default database;
