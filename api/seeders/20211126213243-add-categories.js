"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "category",
      [
        {
          name: "Exercise",
        },
        {
          name: "Education",
        },
        {
          name: "Recipe",
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("category", null, {});
  },
};
