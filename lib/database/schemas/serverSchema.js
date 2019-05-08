const server = {
  id: '',
  prefix: '',
  available: true,
  previousAvailable:{},                      // date-time: available
  channelActivity: {
    activity: [],                             // {channelID, [{userID, count}]}
    date: ''
  },
  previousChannels: {},                       // date-time: channels
  owner: '',                                  // id <Snowflake>
  previousOwner: {},                          // date-time: owner
  name: '',
  previousName: {},                           //date-time: name
  createdAt: '',                              // date-time
  memberCount: 0,
  previousMemberCount: {},                    // date-time: memberCount
  presenceCount: {
    online: 0, idle: 0, dnd: 0
  },
  previousPresenceCount: {},                  // date-time: presenceCount
  memberJoins: [],                            // {id <Snowflake>, date-time}
  previousMemberJoins: {},                    // date-time: memberJoins
  memberLeaves: [],                           // {id <Snowflake, date-time>}
  previousMemberLeaves: {},                   // date-time: memberLeaves
  memberReturns: [],                          // {id <Snowflake>, date-time}
  previousMemberReturns: {},                  // date-time: memberReturns
};

exports.get = () => {
  return server;
};
