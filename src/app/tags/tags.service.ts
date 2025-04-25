import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import { Tags } from 'src/schemas/tags.schema';
import { createTagDto } from './dto/create.dto';
import { DATABASE_CONNECTION } from '@app/common/infra/mongoose/database.config';
const ObjectId = mongoose.Types.ObjectId;

@Injectable()
export class TagsService {
  private readonly logger = new Logger(TagsService.name);

  constructor(
    @InjectModel(Tags.name, DATABASE_CONNECTION.WONDRFLY) private readonly tagsModel: Model<Tags>,
  ) { }

  async createTag(model: createTagDto) {
    const {
      name,
      description,
      categoryIds,
      image,
      logo,
      pattern,
      icon,
      programCount,
      covers,
      isActivated,
    } = model;
    const categoryIdsAsObjectIds = categoryIds.map(
      (id) => new mongoose.Types.ObjectId(id),
    );
    const data = await new this.tagsModel({
      name,
      description,
      categoryIds: categoryIdsAsObjectIds,
      image,
      logo,
      pattern,
      icon,
      programCount,
      covers,
      isActivated,
    }).save();
    return data;
  }

  async getById(id: string) {
    const listResult = await this.tagsModel.aggregate([
      {
        $match: { _id: new ObjectId(id) },
      },
      {
        $lookup: {
          from: 'categories',
          let: { categoryIds: '$categoryIds' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$_id', '$$categoryIds'],
                },
              },
            },
          ],
          as: 'categoryIds',
        },
      },
    ]);
    return listResult;
  }

  async getByCategory(id, page_size: number, page_number: number) {
    const skip = (page_number - 1) * page_size;
    const matchQuery = []
    if (id) {
      matchQuery.push({
        $match:
        {
          $expr: {
            $gt: [{ $size: { $setIntersection: ["$categoryIds", id.split(',').map((id) => new ObjectId(id))] } }, 0]
          },
        }
        // { categoryIds: id.split(',').map((id)=> new ObjectId(id)) }
      },)
    }
    const data = await this.tagsModel.aggregate([
      ...matchQuery,
      {
        $match: { isActivated: true },
      },
      {
        $facet: {
          result: [
            {
              $lookup: {
                from: 'categories',
                let: { categoryIds: '$categoryIds' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $eq: ['$_id', '$$categoryIds'],
                      },
                    },
                  },
                ],
                as: 'categoryIds',
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

  async getAll(page_size: number, page_number: number) {
    const skip = (page_number - 1) * page_size;
    const data = await this.tagsModel.aggregate([
      {
        $lookup: {
          from: 'categories',
          let: { categoryIds: '$categoryIds' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$_id', '$$categoryIds'],
                },
              },
            },
          ],
          as: 'categoryIds',
        },
      },
      {
        $facet: {
          result: [
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
}
