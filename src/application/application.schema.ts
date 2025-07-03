import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as mongoose from 'mongoose';

export type ApplicationDocument = Application & Document;

@Schema({ timestamps: true })
export class Application {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true })
  job: Types.ObjectId;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  candidate: Types.ObjectId;
  @Prop({ required: true }) cvUrl: string;
  @Prop({ required: true, default: Date.now }) appliedAt: Date;
}

export const ApplicationSchema = SchemaFactory.createForClass(Application);
