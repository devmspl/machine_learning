import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { programurlInterface } from 'src/@types/interfaces/programurl';
import { Programurl } from 'src/schemas/programurl.schema';
import { User } from 'src/schemas/user.schema';
import { ProgramService } from '../program/program.service';
import { Webscraping } from 'src/schemas/webscraping.schema';
import { DATABASE_CONNECTION } from '@app/common/infra/mongoose/database.config';
const ObjectId = mongoose.Types.ObjectId;

@Injectable()
export class ProgramurlService {
    constructor(
        @InjectModel(User.name,DATABASE_CONNECTION.WONDRFLY) private readonly userModel: Model<User>,
        @InjectModel(Webscraping.name,DATABASE_CONNECTION.WONDRFLY) private readonly webscrapingModel: Model<Webscraping>,
        @InjectModel(Programurl.name,DATABASE_CONNECTION.WONDRFLY)
        private readonly ProgramurlModel: Model<Programurl>,
        private programService: ProgramService
    ) { }

    async create(model: programurlInterface) {
        const { userId, status, url } = model;
        const data = await new this.ProgramurlModel({
            userId,
            status,
            url
        }).save();
        return data;
    }
    async crecreateMultipleate(model: any) {
        const { userId, status, urls } = model;
        // const data = await new this.ProgramurlModel({
        //     userId,
        //     status,
        //     url
        // }).save();
        let programUrls=urls.map((url)=>{
            return {
                userId,
                status,
                url
            }
        })
        const data=await this.ProgramurlModel.insertMany(programUrls)
        return data;
    }
    async getById(id: string) {
        const listResult = await this.ProgramurlModel.aggregate([
            {
                $match: { _id: new ObjectId(id) },
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'userId',
                },
            },
            { $unwind: { path: '$userId', preserveNullAndEmptyArrays: true } },
        ]);
        return listResult;
    }

    async getByUser(id, page_size: number, page_number: number,status:string) {
        const skip = (page_number - 1) * page_size;
        const data = await this.ProgramurlModel.aggregate([
            { $match: { userId: new ObjectId(id),status:status?status:"pending" } },
            {
                $facet: {
                    result: [
                        {
                            $lookup: {
                                from: 'users',
                                localField: 'userId',
                                foreignField: '_id',
                                as: 'userId',
                            },
                        },
                        { $unwind: { path: '$userId', preserveNullAndEmptyArrays: true } },
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
        const data = await this.ProgramurlModel.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'userId',
                },
            },
            { $unwind: { path: '$userId', preserveNullAndEmptyArrays: true } },
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

    async deleteById(id) {

        const data = await this.ProgramurlModel.findByIdAndDelete(id);

        if (!data) {
            throw new Error('Program Url Not Found');
        }

        return data;
    }

    async updateById(id, model) {

        const programurl = await this.ProgramurlModel.findById(id);

        if (!programurl) {
            throw new Error('Program Url Not Found');
        }

        if (model.status !== undefined && model.status !== 'string' && model.status !== '') {
            programurl.status = model.status;
        }
        if (model.url !== undefined && model.url !== 'string' && model.url !== '') {
            programurl.url = model.url;
        }
        if (model.url !== undefined && model.url !== 'string' && model.url !== '') {
            programurl.url = model.url;
        }
        await programurl.save();

        return programurl;
    }

   async addTempProgramsFromProgramsUrlList(providerId) {
        const programurls = await this.ProgramurlModel.aggregate([
            { $match: { userId: new ObjectId(providerId) } },
        ])
        for(const programurl of programurls) {
         await this.programService.getProgramDataFromUrl(programurl.url, providerId);
         await this.ProgramurlModel.findByIdAndUpdate(programurl._id, { $set: { status: 'processed' } })
          // Introduce a 3-minute delay
         await this.delay(3 * 60 * 1000); // 3 minutes in milliseconds
        }
        return "Add programs successfully";
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
