import { DATABASE_CONNECTION } from '@app/common/infra/mongoose/database.config';
import { HttpException, HttpStatus, Injectable, Req } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { ScriptLogs } from 'src/schemas/script-logs.schema';
const ObjectId = mongoose.Types.ObjectId;

@Injectable()
export class ScriptLogsService {
    constructor(
      @InjectModel(ScriptLogs.name,DATABASE_CONNECTION.WONDRFLY) private readonly scriptLogsModel: Model<ScriptLogs>,
    ) {}
  
    async create(model: any) {
      const { cityId, urls, name, status,startedBy } = model;
      const createdScript = [];
            const data = await new this.scriptLogsModel({
              cityId,
              name,
              status,
              startedBy:startedBy,
            }).save();
      return createdScript;
    }
    
    
  
    async getById(id: string) {
      const [listResult] = await this.scriptLogsModel.aggregate([
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
      const data = await this.scriptLogsModel.aggregate([
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
  
    async getAll(id, status, sort, page_size: number, page_number: number) {
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
      const data = await this.scriptLogsModel.aggregate([
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
      const user = await this.scriptLogsModel.findByIdAndDelete({ _id: id });
  
      if (!user) {
        throw new HttpException('Script logs not found', HttpStatus.BAD_REQUEST);
      }
  
      return 'Script logs removed';
    }
  
    async update(id: string, model: any, @Req() req) {
      const program = await this.scriptLogsModel.findById(id);
  
      if (!program) {
        throw new HttpException('Script logs not found', HttpStatus.BAD_REQUEST);
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
  
      await program.save();
  
      return program;
    }
  }
