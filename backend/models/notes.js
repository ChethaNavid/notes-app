import sequelize from "../database/database.js";
import { DataTypes } from "sequelize";

export const Note = sequelize.define("Note", {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    tags: {
        type: DataTypes.JSON,  
    },
    isPinned: {
        type: DataTypes.BOOLEAN
    }
})