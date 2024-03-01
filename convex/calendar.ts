import { v } from 'convex/values'
import { mutation, query } from './_generated/server'
import { Doc, Id } from './_generated/dataModel'
export const createCalendarSchedule = mutation({
    args: {
        schedule:v.optional(v.string())
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Not authenticated")
        }
        const userId = identity.subject
        console.log(userId)
        console.log(args.schedule)
        const calendarSchedule = await ctx.db.insert("calendarSchedule", {
            userId,
            schedule: args.schedule
        })
        return calendarSchedule
    }
})
export const getSchedule = query({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity()
        if (!identity) {
            throw new Error("Not authenticated!")
        }

        const userId = identity.subject
        const calendarSchedule = await ctx.db
        .query("calendarSchedule")
        .order("desc")
        .collect()
        return calendarSchedule

    }
})
export const removeSchedule = mutation({
    args: { id: v.id("calendarSchedule") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()
        if (!identity) {
            throw new Error("Not authenticated")
        }
        const userId = identity.subject
        const existingSchedule = await ctx.db.get(args.id)
        if (!existingSchedule) {
            throw new Error("Schedule not found")
        }
        if (existingSchedule.userId !== userId) {
            throw new Error("Unauthorized")
        }
        const calendarSchedule = await ctx.db.delete(args.id)
        return calendarSchedule
    }
})