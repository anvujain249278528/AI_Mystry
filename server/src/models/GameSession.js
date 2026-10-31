import mongoose from 'mongoose';

const interrogationSchema = new mongoose.Schema({
  suspectId: { type: String, required: true },
  question: { type: String, required: true },
  response: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
}, { _id: false });

const hintSchema = new mongoose.Schema({
  level: { type: Number, min: 1, max: 3, required: true },
  content: { type: String, required: true },
  usedAt: { type: Date, default: Date.now },
}, { _id: false });

const gameSessionSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  mysteryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Mystery', required: true, index: true },
  ownerTokenHash: { type: String, required: true, select: false },
  status: { type: String, enum: ['active', 'completed'], default: 'active', index: true },
  discoveredClueIds: { type: [String], default: [] },
  interrogationHistory: { type: [interrogationSchema], default: [] },
  hintsUsed: { type: [hintSchema], default: [] },
  selectedSuspectId: { type: String, default: null },
  finalScore: { type: Number, default: null },
  startedAt: { type: Date, default: Date.now },
  completedAt: { type: Date, default: null },
}, { versionKey: false });

gameSessionSchema.index({ status: 1, startedAt: -1 });

export const GameSession = mongoose.model('GameSession', gameSessionSchema);
