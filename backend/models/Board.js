const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    text: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now }
});

const taskSchema = new Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    dueDate: { type: Date, default: null },
    order: { type: Number, required: true },
    labels: [{
        color: { type: String },
        text: { type: String, default: '' }
    }],
    parentTaskId: { type: String, default: null },
    subtaskIds: [{ type: String }],
    comments: [commentSchema]
}, { 
    _id: true,
    timestamps: true 
});

const listSchema = new Schema({
    title: { type: String, required: true, trim: true },
    order: { type: Number, required: true },
    tasks: [taskSchema]
}, { _id: true });

const memberSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    role: { type: String, enum: ['admin', 'editor', 'viewer'], default: 'editor' }
}, { _id: false });

const boardSchema = new Schema({
    title: { type: String, required: true, trim: true },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    members: [memberSchema],
    lists: [listSchema]
}, {
    timestamps: true
});

module.exports = mongoose.model('Board', boardSchema);