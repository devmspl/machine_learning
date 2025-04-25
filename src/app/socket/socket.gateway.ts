import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Cache } from 'cache-manager';
import { Inject } from '@nestjs/common';
import { Server } from 'socket.io';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { pipe } from 'rxjs';

interface fence_area {
  latitude: number;
  longitude: number;
  user_id: string;
}
const toObjectId = Types.ObjectId;
@WebSocketGateway()
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(@Inject('CACHE_MANAGER') private cache: Cache) {}

  myUsers = new Map<string, any>();
  // initial socket  io server
  @WebSocketServer()
  public server: Server;

  handleConnection(client: any, ...args: any[]) {
    console.log('user join id is', client.id);
  }

  handleDisconnect(client: any) {
    console.log('disconnect');
  }

  @SubscribeMessage('join-user')
  async join_user(client: any, userId: string) {
    console.log(userId);

    this.cache.set(`${userId}`, client.id);

    this.myUsers.set(userId, client.id);

    client.join(client.id);

    this.server.to(client.id).emit('join-user', 'user joinded');
  }

  @SubscribeMessage('find-user-fence-area')
  async find_user_fence_area(client: Server, model: fence_area) {
    try {
      const longitude = Number(model.longitude);
      const latitude = Number(model.latitude);

      const userSocketId = this.myUsers.get(model.user_id);

      console.log(this.myUsers, 'iddd');

      // if (userSocketId) {
      //   const result = await this.fenceModel.aggregate([
      //     {
      //       $geoNear: {
      //         near: {
      //           type: 'Point',
      //           coordinates: [longitude, latitude],
      //         },
      //         distanceField: 'distance',
      //         maxDistance: Math.floor(1000 * 50),
      //         spherical: true,
      //       },
      //     },
      //     {
      //       $match: {
      //         $expr: {
      //           $gte: ['$diameter_radius', '$distance'],
      //         },
      //       },
      //     },
      //     {
      //       $lookup: {
      //         from: 'rides',
      //         let: { fenceID: '$_id' },
      //         pipeline: [
      //           {
      //             $match: {
      //               $expr: {
      //                 $eq: ['$fence_area', '$$fenceID'],
      //               },
      //             },
      //           },
      //         ],
      //         as: 'rides',
      //       },
      //     },
      //     {
      //       $sort: {
      //         diameter_radius: 1,
      //       },
      //     },
      //     {
      //       $limit: 1,
      //     },
      //   ]);
      //   console.log(result);
      //   client.emit('find-user-fence-area', result);
      // }
    } catch (Err) {
      client.emit('error-msg', Err.message);
      console.log(Err);
    }
  }

  @SubscribeMessage('find-user-nearest-ride')
  async find_user_nearest_ride(
    client: any,
    model: fence_area & { fence_id: string },
  ) {
    try {
      console.log(model);
      const { fence_id, user_id, longitude, latitude } = model;
      const socketId = this.myUsers.get(user_id);
      console.log(socketId, 'socketId');
      if (socketId) {
        // const data = await this.rideModel.aggregate([
        //   {
        //     $geoNear: {
        //       near: {
        //         type: 'Point',
        //         coordinates: [Number(longitude), Number(latitude)],
        //       },
        //       distanceField: 'distance',
        //       maxDistance: Number(200),
        //       spherical: true,
        //     },
        //   },
        //   {
        //     $match: {
        //       fence_area: { $eq: new toObjectId(fence_id) },
        //     },
        //   },
        //   {
        //     $sort: {
        //       distance: 1,
        //     },
        //   },
        //   {
        //     $limit: 1,
        //   },
        // ]);
        // client.emit('find-user-nearest-ride', data);
      }
    } catch (Err) {
      client.emit('error-msg', Err.message);
      console.log(Err);
    }
  }

  @SubscribeMessage('find-for-start-ride')
  async getStartRide(
    client: Server,
    model: { fence_id: string } & fence_area,
  ): Promise<never | void> {
    try {
      // const data = await this.rideModel.aggregate([
      //   {
      //     $geoNear: {
      //       near: {
      //         type: 'Point',
      //         coordinates: [Number(model.longitude), Number(model.latitude)],
      //       },
      //       distanceField: 'distance',
      //       maxDistance: Number(50),
      //       spherical: true,
      //     },
      //   },
      //   {
      //     $match: {
      //       fence_area: new toObjectId(model.fence_id),
      //     },
      //   },
      // ]);
      // client.emit('find-for-start-ride', [...data]);
    } catch {
      client.emit('error-msg', 'something went wrong!');
    }
  }
}
