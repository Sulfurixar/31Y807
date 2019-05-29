const server = {
  // Analytics
  id: '',
  available: true,
  previousAvailable:{},                      // date-time: available
  channelActivity: {
    activity: {},                             // {channelID: userID: {
                                              //    join: 0,
                                              //    leave: 0,
                                              //    message: 0
                                              //  }}
    date: ''
  },
  previousChannelActivity: {},                // date-time: channels
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
  memberJoins: {},                            // {id <Snowflake>, date-time}
  previousMemberJoins: {},                    // date-time: memberJoins
  memberLeaves: {},                           // {id <Snowflake, date-time>}
  previousMemberLeaves: {},                   // date-time: memberLeaves
  memberReturns: {},                          // {id <Snowflake>, date-time}
  previousMemberReturns: {},                  // date-time: memberReturns
  memberBans: {},                             // date-time: [memberID]
  memberUnbans: {},                           // date-time: [memberID]

  // bot functionality
  prefix: '',
  //botMessageBuffer: [],                       // [id, id, id, id, id] - gets deleted as new messages appear
  //botErrorBuffer: [],                         // [id, id, id, id, id] - gets deleted only on bot resets
};

exports.get = () => {
  return server;
};
