import sequelize from "../database/database.js";
import { User } from "./users.js";
import { Note } from "./notes.js";

User.hasMany(Note, {
    foreignKey: {
        name: "userId",
        allowNull: false
    },
    onDelete: "CASCADE"
});

Note.belongsTo(User, {
    foreignKey: {
        name: "userId",
        allowNull: false,
    },
    onDelete: "CASCADE"
})

export { sequelize, User, Note };