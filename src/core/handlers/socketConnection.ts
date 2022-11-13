import User from "../../model/User";
import { ObjectId } from "mongoose";

import chat from "../../controllers/chat.controller";
import socketAuth from "../../utils/socket-auth";

const socketCon = {
  socketConnection: (io: any) => {
    var connections: any = {};
    const connectedNames: any = {};
    var userDataObject: any;
    var userId: ObjectId;
    var userFullName: string;

    // methods
    const computeUserDetails = async (response: any) => {
      userDataObject = await User.findById(response.id);
      userId = userDataObject._id as ObjectId;
      userFullName = userDataObject.first_name + " " + userDataObject.last_name;
    };

    // create socket connection
    io.on("connection", async (socket: any) => {
      let token = socket.handshake.headers.authorization;

      // if there is no auth header,disconnect connected socket
      if (!token) {
        return socket.emit("noAuthDisconect", {
          statusCode: 401,
          message: "Unauthorized",
        });
      }

      // look up auth token
      const response = socketAuth(token);
      if (!response.id) {
        return socket.emit("noAuthDisconect", {
          statusCode: 401,
          message: "Unauthorized",
        });
      }

      //  compute user data
      await computeUserDetails(response);

      if (userId) {
        connections[userId as any] = socket.id;
        console.log(connections, userFullName);
        connectedNames[userId as any] = userFullName;

        console.log(" socket connected");
        // join private group
        socket.join(userId);

        // listen for messages

        socket.on(
          "message",
          async (data: {
            
            recieverId: ObjectId;
            message: string;
            attatchment: string[];
          }) => {
            // get own id
            let token = socket.handshake.headers.authorization;
            const response = socketAuth(token);
            // recompute the user's data
            chat.addChat(
              socket,
              data,
              response.id as ObjectId,
              connectedNames[[response.id] as any] as string,
              connections
            );
          }
        );
        // send a notification  that a user started typing
        socket.on("typing", (data: any) => {
          socket
            .to(connections[[data.recipient] as any])
            .emit("typing", { value: data.value });
        });

        // voice call
        socket.on("call_init", async () => {});
        socket.on("call_answer", async () => {});
        socket.on("call_reject", async () => {});

        socket.on("disconnect", () => {
          console.log("disconnected");
        });
      }
    });
  },
};

export { socketCon };
