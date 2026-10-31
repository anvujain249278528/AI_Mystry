import mongoose from 'mongoose';

const suspectSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  age: { type: Number, required: true },
  occupation: { type: String, required: true },
  relationship: { type: String, required: true },
  background: { type: String, required: true },
  motive: { type: String, required: true },
  alibi: { type: String, required: true },
  personality: { type: String, required: true },
  openingStatement: { type: String, required: true },
  privateKnowledge: { type: String, required: true, select: false },
}, { _id: false });

const clueSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, required: true },
  discoveryLocation: { type: String, required: true },
  relatedSuspectIds: [{ type: String }],
  relevance: { type: String, required: true, select: false },
  discoveryCondition: { type: String, enum: ['initial', 'hidden'], required: true },
}, { _id: false });

const solutionSchema = new mongoose.Schema({
  culpritId: { type: String, required: true },
  motive: { type: String, required: true },
  method: { type: String, required: true },
  timeline: { type: String, required: true },
  explanation: { type: String, required: true },
  decisiveClueIds: [{ type: String, required: true }],
}, { _id: false, select: false });

const mysterySchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
  scenario: { type: String, required: true },
  location: { type: String, required: true },
  crimeTime: { type: String, required: true },
  victimDetails: { type: String, default: '' },
  briefing: { type: String, required: true },
  suspects: { type: [suspectSchema], required: true },
  clues: { type: [clueSchema], required: true },
  investigationQuestions: { type: [String], default: [] },
  origin: { type: String, enum: ['generated', 'custom'], default: 'generated' },
  solution: { type: solutionSchema, required: true, select: false },
}, { timestamps: true, versionKey: false });

mysterySchema.index({ difficulty: 1, createdAt: -1 });

export const Mystery = mongoose.model('Mystery', mysterySchema);
