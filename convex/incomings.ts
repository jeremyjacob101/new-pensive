import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("incomings").collect();
  },
});

export const create = mutation({
  args: {
    incoming: v.string(),
    paidBy: v.string(),
    incomeType: v.string(),
    account: v.string(),
    amount: v.number(),
    date: v.string(),
    monthYear: v.string(),
    notes: v.optional(v.string()),
    comments: v.optional(v.string()),
    incomingId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("incomings", args);
  },
});

export const bulkCreate = mutation({
  args: {
    rows: v.array(
      v.object({
        incoming: v.string(),
        paidBy: v.string(),
        incomeType: v.string(),
        account: v.string(),
        amount: v.number(),
        date: v.string(),
        monthYear: v.string(),
        notes: v.optional(v.string()),
        comments: v.optional(v.string()),
        incomingId: v.string(),
      }),
    ),
  },
  handler: async (ctx, { rows }) => {
    for (const row of rows) {
      await ctx.db.insert("incomings", row);
    }
    return { inserted: rows.length };
  },
});

export const clearAll = mutation({
  args: { batchSize: v.optional(v.number()) },
  handler: async (ctx, { batchSize }) => {
    const limit = batchSize ?? 200;
    const docs = await ctx.db.query("incomings").take(limit);
    for (const doc of docs) {
      await ctx.db.delete(doc._id);
    }
    return { deleted: docs.length, done: docs.length < limit };
  },
});
