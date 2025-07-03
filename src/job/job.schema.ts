import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as mongoose from 'mongoose';

export type JobDocument = Job & Document;

@Schema({ timestamps: true })
export class Job {
  @Prop({ required: true }) title: string;
  @Prop({ required: true }) description: string;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  recruiter: Types.ObjectId;
  @Prop({ required: true, default: true })
  status: boolean;
}

export const JobSchema = SchemaFactory.createForClass(Job);
