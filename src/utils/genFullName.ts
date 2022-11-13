import { ObjectId } from "mongodb";
import User from "../model/User";
interface genFullName {
  (id: ObjectId): Promise<string | void>;
}
const genFullName: genFullName = async function (id: ObjectId) {
  const user = await User.findById(id);
  if (user) {
    const fullName = `${user.first_name}  ${user.last_name}`;
    return fullName;
  }
  return;
};

export default genFullName;
