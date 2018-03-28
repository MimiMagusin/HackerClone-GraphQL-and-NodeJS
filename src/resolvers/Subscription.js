const newLink = {
  subscribe: (parent, args, ctx, info) => {
    return ctx.db.subscription.link(
      {}, // Empty because of a bug, should be { where: { mutation_in: ['CREATED'] } }
      info,
    )
  },
}

const newVote = {
  subscribe: (parent, args, ctx, info) => {
    return ctx.db.subscription.vote(
      {},
      info,
    )
  },
}

module.exports = {
  newLink,
  newVote,
}