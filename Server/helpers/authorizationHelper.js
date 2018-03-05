
module.exports = {

  readUserId(req) {
    const auth = req.get('authorization');
    let id;
    if (auth) {
      [id] = Buffer.from(auth.split(' ').pop(), 'base64').toString('ascii').split(':');
    }
    if (!id || !auth) {
      throw new Error('Not authorized');
    }
    return id;
  },

};
