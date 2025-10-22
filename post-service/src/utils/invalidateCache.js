// Invalidate all the data present in Cache with key - posts
const invalidatePostsCache = async (req, input) => {
   
  const cacheKey = `posts:${input}`;
  await req.redisClient.del(cacheKey);

  const keys = await req.redisClient.keys("posts:*");
  if (keys.length > 0) {
    await req.redisClient.del(keys);
  }
};

module.exports=invalidatePostsCache;
