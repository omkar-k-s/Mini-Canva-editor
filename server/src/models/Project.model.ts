import { Schema, model, Document, Types } from 'mongoose'

export interface IProject extends Document {
  title:           string
  description?:    string
  thumbnail?:      string
  canvasData:      string
  canvasWidth:     number
  canvasHeight:    number
  backgroundColor: string
  tags:            string[]
  userId:          Types.ObjectId
  createdAt:       Date
  updatedAt:       Date
}

const projectSchema = new Schema<IProject>(
  {
    title:           { type: String, required: true, trim: true, maxlength: 200 },
    description:     { type: String, trim: true, maxlength: 500 },
    thumbnail:       { type: String },
    canvasData:      { type: String, required: true },   // JSON string of Fabric.js canvas
    canvasWidth:     { type: Number, required: true, default: 1080 },
    canvasHeight:    { type: Number, required: true, default: 1080 },
    backgroundColor: { type: String, default: '#ffffff' },
    tags:            [{ type: String, trim: true }],
    userId:          { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  },
  { timestamps: true }
)

// Index for user's project list query
projectSchema.index({ userId: 1, updatedAt: -1 })

export const Project = model<IProject>('Project', projectSchema)
