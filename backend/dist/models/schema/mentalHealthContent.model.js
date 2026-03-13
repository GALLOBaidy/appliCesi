"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mentalHealthContent = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const user_model_1 = require("./user.model");
exports.mentalHealthContent = (0, pg_core_1.pgTable)("mental_health_content", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    title: (0, pg_core_1.varchar)("title", { length: 255 }).notNull(),
    body: (0, pg_core_1.text)("body").notNull(),
    category: (0, pg_core_1.varchar)("category", { length: 100 }).notNull(),
    isActive: (0, pg_core_1.boolean)("is_active").default(true).notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().notNull(),
    createdBy: (0, pg_core_1.integer)("created_by").references(() => user_model_1.users.userId, {
        onDelete: "set null",
    }),
});
