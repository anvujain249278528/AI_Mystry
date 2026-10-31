import mongoose from 'mongoose';

const investigationResultSchema = new mongoose.Schema({
  gameSessionId: { type: String, required: true, unique: true },
  mysteryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Mystery', required: true, index: true },
  selectedSuspectId: { type: String, required: true },
  actualCulpritId: { type: String, required: true },
  isCorrect: { type: Boolean, required: true },
  hintsUsed: { type: Number, required: true },
  finalScore: { type: Number, required: true },
  completedAt: { type: Date, required: true, index: true },
}, { versionKey: false });

export const InvestigationResult = mongoose.model('InvestigationResult', investigationResultSchema);
