const {DataTypes} = require("sequelize");
const db = require("../db");

// May have certain data not be contained within model like commits by contributor
const User_Info = db.define("user_info", {
    username: {
        type: DataTypes.TEXT,
        allowNull: false
    },

    repo_name: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    date_created: {
        type: DataTypes.TEXT,
        allowNull: false
    },

    last_updated: {
        type: DataTypes.TEXT,
        allowNull: false
    },

    total_commits: {
        type: DataTypes.TEXT,
        allowNull: false
    },

    repo_description: {
        type: DataTypes.TEXT,
        allowNull: false
    },

    responsiveness: {
        type: DataTypes.TEXT,
        allowNull: false
    },

    pr_integration_time: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    unreviewed_prs: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    time_to_merge: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    follow_on_commits: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    rework: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    impact: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    
});

module.exports = User_Info;