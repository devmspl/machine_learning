import { HttpException, HttpStatus, Injectable, Req } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { queueInterface } from 'src/@types/interfaces/queue';
import { Queue } from 'src/schemas/queue.schema';
import { createQueueDto } from './dto/create.dto';
import { DATABASE_CONNECTION } from '@app/common/infra/mongoose/database.config';
const ObjectId = mongoose.Types.ObjectId;

Injectable();
export class QueueService {
  constructor(
    @InjectModel(Queue.name,DATABASE_CONNECTION.WONDRFLY) private readonly queueModel: Model<Queue>,
  ) {}

  // }

  // async createQueue(model: createQueueDto) {
  //   const { cityId, urls, type, notes, admin_notes, status, urls_limit } =
  //     model;
  //   const createdQueues = [];

  //   for (const url of urls) {
  //     const data = await new this.queueModel({
  //       cityId,
  //       urls: [url],
  //       type,
  //       notes,
  //       admin_notes,
  //       status,
  //       urls_limit,
  //     }).save();

  //     createdQueues.push(data);
  //   }

  //   return createdQueues;
  // }

  // async createQueue(model: createQueueDto) {
  //   const { cityId, urls, type, notes, admin_notes, status, urls_limit } =
  //     model;
  //   const createdQueues = [];

  //   for (const url of urls) {
  //     const existingQueue = await this.queueModel.findOne({
  //       cityId,
  //       urls: url,
  //       type,
  //       notes,
  //       admin_notes,
  //       status,
  //       urls_limit,
  //     });

  //     if (!existingQueue) {
  //       const data = await new this.queueModel({
  //         cityId,
  //         urls: [url],
  //         type,
  //         notes,
  //         admin_notes,
  //         status,
  //         urls_limit,
  //       }).save();

  //       createdQueues.push(data);
  //     } else {
  //       console.log(`Duplicate entry found for URL: ${url}`);
  //     }
  //   }

  //   return createdQueues;
  // }
  async createQueue(model: createQueueDto) {
    const { cityId, urls, type, notes, admin_notes, status, urls_limit } = model;
    const createdQueues = [];

    function isValidURL(url: string): boolean {
      const urlPattern = /^https?:\/\/(?:www\.)?[\w-]+(\.[\w-]+)+[\w.,@?^=%&:/~+#-]*$/;
      return urlPattern.test(url);
    }
  
    for (const url of urls) {
      // Check if the URL is valid
      if (isValidURL(url)) {
        const existingQueue = await this.queueModel.findOne({
          cityId,
          urls: url,
          type,
          notes,
          admin_notes,
          status,
          urls_limit,
        });
  
        if (!existingQueue) {
          const data = await new this.queueModel({
            cityId,
            urls: [url],
            type,
            notes,
            admin_notes,
            status,
            urls_limit,
          }).save();
  
          createdQueues.push(data);
        } else {
          console.log(`Duplicate entry found for URL: ${url}`);
        }
      } else {
        console.log(`Invalid URL: ${url}`);
      }
    }
  
    return createdQueues;
  }
  
  

  async getById(id: string) {
    const [listResult] = await this.queueModel.aggregate([
      {
        $match: { _id: new ObjectId(id) },
      },
      {
        $lookup: {
          from: 'citymanagements',
          localField: 'cityId',
          foreignField: '_id',
          as: 'cityId',
        },
      },
    ]);
    return listResult;
  }

  async getByCity(id, page_size: number, page_number: number) {
    const skip = (page_number - 1) * page_size;
    const data = await this.queueModel.aggregate([
      { $match: { cityId: new ObjectId(id) } },
      {
        $facet: {
          result: [
            {
              $lookup: {
                from: 'citymanagements',
                localField: 'cityId',
                foreignField: '_id',
                as: 'cityId',
              },
            },
            { $limit: page_size + skip },
            { $skip: skip },
            { $sort: { created_at: -1 } },
          ],
          tasksCount: [
            {
              $group: {
                _id: '',
                total: { $sum: '$total' },
              },
            },
            {
              $project: {
                _id: 0,
                tasksCount: '$total',
              },
            },
          ],
          totalCount: [
            {
              $count: 'count',
            },
          ],
        },
      },
    ]);
    const totalCount = data[0].totalCount[0] ? data[0].totalCount[0].count : 0;
    const items = data[0].result;

    return {
      currentPage: page_number,
      pageSize: page_size,
      totalCount: totalCount,
      items: items,
    };
  }

  async getAllQueue(id, status, sort, page_size: number, page_number: number) {
    const skip = (page_number - 1) * page_size;
    let sorting = null;
    !!sort && (sorting = {});
    if (sort == 'byName') {
      sorting = { 'cityId.name': 1 };
    } else if (sort == 'byDate') {
      sorting = { createdOn: -1 };
    } else {
      sorting = { 'cityId.name': 1 };
    }
    const data = await this.queueModel.aggregate([
      { $match: { cityId: new ObjectId(id), status: status } },
      {
        $facet: {
          result: [
            {
              $lookup: {
                from: 'citymanagements',
                localField: 'cityId',
                foreignField: '_id',
                as: 'cityId',
              },
            },
            { $unwind: { path: '$cityId', preserveNullAndEmptyArrays: true } },
            { $sort: sorting || { 'cityId.name': 1 } },
            { $limit: page_size + skip },
            { $skip: skip },
          ],
          tasksCount: [
            {
              $group: {
                _id: '',
                total: { $sum: '$total' },
              },
            },
            {
              $project: {
                _id: 0,
                tasksCount: '$total',
              },
            },
          ],
          totalCount: [
            {
              $count: 'count',
            },
          ],
        },
      },
    ]);
    const totalCount = data[0].totalCount[0] ? data[0].totalCount[0].count : 0;
    const items = data[0].result;

    return {
      currentPage: page_number,
      pageSize: page_size,
      totalCount: totalCount,
      items: items,
    };
  }

  async remove(id: string) {
    const user = await this.queueModel.findByIdAndDelete({ _id: id });

    if (!user) {
      throw new HttpException('queue not found', HttpStatus.BAD_REQUEST);
    }

    return 'queue removed';
  }

  async update(id: string, model: Partial<queueInterface>, @Req() req) {
    const program = await this.queueModel.findById(id);

    if (!program) {
      throw new HttpException('program not found', HttpStatus.BAD_REQUEST);
    }
    if (
      model.cityId !== 'string' &&
      model.cityId !== '' &&
      model.cityId !== undefined
    ) {
      program.cityId = model.cityId;
    }

    if (
      model.status !== 'string' &&
      model.status !== '' &&
      model.status !== undefined
    ) {
      program.status = model.status;
    }

    if (model.urls !== undefined) {
      program.urls = model.urls;
    }

    if (model.addProvider !== undefined) {
      program.addProvider = model.addProvider;
    }

    if (model.urls_limit !== undefined && model.urls_limit !== 0) {
      program.urls_limit = model.urls_limit;
    }

    if (
      model.type !== 'string' &&
      model.type !== '' &&
      model.type !== undefined
    ) {
      program.type = model.type;
    }

    if (
      model.notes !== 'string' &&
      model.notes !== '' &&
      model.notes !== undefined
    ) {
      program.notes = model.notes;
    }
    if (
      model.admin_notes !== 'string' &&
      model.admin_notes !== '' &&
      model.admin_notes !== undefined
    ) {
      program.admin_notes = model.admin_notes;
    }
    await program.save();

    return program;
  }

  // async updateQueueUrl(id: string, UrlId: string, model: any, @Req() req) {
  //   const program = await this.queueModel.findById(id);

  //   const batch = await this.queueModel.findOne({ 'urls._id': UrlId });

  //   if (!program) {
  //     throw new HttpException('Queue not found', HttpStatus.BAD_REQUEST);
  //   }

  //   if (!batch) {
  //     throw new HttpException('Queue Urls Not Found', HttpStatus.BAD_REQUEST);
  //   }

  //   if (model.urls !== undefined) {
  //     program.urls = program.urls.map((b_doc) => {
  //       if (UrlId == `${b_doc._id}`) {
  //         b_doc = { ...b_doc, ...model.urls };
  //       }
  //       return b_doc;
  //     });
  //   }

  //   await program.save();

  //   return program;
  // }

  // async deleteQueueUrl(id: string, UrlId: string) {
  //   const program = await this.queueModel.updateOne(
  //     { _id: new ObjectId(id) },
  //     { $pull: { urls: { 'urls._id': UrlId } } },
  //     { new: true },
  //   );
  //   console.log('program ====>>>>>', program);
  //   // const program = await this.queueModel.findById(id);

  //   // const batch = await this.queueModel.findOne({ 'urls._id': UrlId });

  //   if (!program) {
  //     throw new HttpException('Queue not found', HttpStatus.BAD_REQUEST);
  //   }

  //   // if (!batch) {
  //   //   throw new HttpException('Queue Urls Not Found', HttpStatus.BAD_REQUEST);
  //   // }

  //   // await program.save();

  //   return program;
  // }

  async duplicateQue(model: createQueueDto) {
    const { cityId, urls, type, notes, admin_notes, status, urls_limit } =
      model;
    const duplicateQueues = [];

    for (const url of urls) {
      const existingQueue = await this.queueModel.findOne({
        // cityId,
        urls: url,
        // type,
        // notes,
        // admin_notes,
        // status,
        // urls_limit,
      });

      if (existingQueue) {
        console.log(`Duplicate entry found for URL: ${url}`);
        duplicateQueues.push(url);
      }
    }
    return duplicateQueues;
  }

  async searchQueue(id, status,name, sort, page_size: number, page_number: number) {
    const skip = (page_number - 1) * page_size;
    let matchQueries = [];

    let match = { cityId: new ObjectId(id), status: status };

    let sorting = null;
    !!sort && (sorting = {});
    if (name) {
      matchQueries = [
        {
          $match: {
            $or: [
              { urls: { $regex: '.*' + name + '.*', $options: 'i' } },
              // { addressLine1: { $regex: '.*' + name + '.*', $options: 'i' } },
              // { phoneNumber: { $regex: '.*' + name + '.*', $options: 'i' } },
              // { email: { $regex: '.*' + name + '.*', $options: 'i' } },
            ],
          },
        },
      ];
    }
    if (sort == 'byName') {
      sorting = { 'cityId.name': 1 };
    } else if (sort == 'byDate') {
      sorting = { createdOn: -1 };
    } else {
      sorting = { 'cityId.name': 1 };
    }
    const data = await this.queueModel.aggregate([
      // { $match: { cityId: new ObjectId(id), status: status } },
      ...matchQueries,
      { $match: match },
      {
        $facet: {
          result: [
            {
              $lookup: {
                from: 'citymanagements',
                localField: 'cityId',
                foreignField: '_id',
                as: 'cityId',
              },
            },
            { $unwind: { path: '$cityId', preserveNullAndEmptyArrays: true } },
            { $sort: sorting || { 'cityId.name': 1 } },
            { $limit: page_size + skip },
            { $skip: skip },
          ],
          tasksCount: [
            {
              $group: {
                _id: '',
                total: { $sum: '$total' },
              },
            },
            {
              $project: {
                _id: 0,
                tasksCount: '$total',
              },
            },
          ],
          totalCount: [
            {
              $count: 'count',
            },
          ],
        },
      },
    ]);
    const totalCount = data[0].totalCount[0] ? data[0].totalCount[0].count : 0;
    const items = data[0].result;

    return {
      currentPage: page_number,
      pageSize: page_size,
      totalCount: totalCount,
      items: items,
    };
  }
}
