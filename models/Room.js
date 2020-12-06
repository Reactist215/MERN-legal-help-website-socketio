const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const RoomSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: ['3', 'Room name should be greater than 3 characters']
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    },
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    }
);

RoomSchema.methods.isValidPassword = function (password) {
    return bcrypt.compare(password, this.password);
};

RoomSchema.pre('save', function (next) {
    if (this.password !== '' && this.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(this.password, salt, (err, res) => {
                this.password = res;
                next();
            });
        });
    } else {
        next();
    }
});

const Room = mongoose.model('Room', RoomSchema);

module.exports = { Room };
