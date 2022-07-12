import { Schema, model, Types, Document } from 'mongoose';

export interface IUser extends Document {
    email: string;
    password: string;
    login: string;
    readonly id: Types.ObjectId;
}

const schema = new Schema<IUser>({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    login: { type: String, required: true, unique: true },
    id: { type: Schema.Types.ObjectId, ref: 'id' }
});

export default model<IUser>('User', schema);
