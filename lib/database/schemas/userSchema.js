const user = {
  id: '',
  presence: {
    status: '',
    game: {
      details: '',
      name: '',
      party: 0,               //party.size
      state: '',
      streaming: false,
      stream: ''
    }
  },
  previousPresence: {},
  createdAt: '',
  tag: '',
  previousTag: {},
  nicknames: {},
  previousNicknames: {},
  IRLData: {
    firstName: '',
    secondaryNames: [],
    lastName: '',
    nickNames: [],
    birthDate: '',
    timeZone: '',
    language: '',
    nationality: [],
    country: ''
  },
  previousIRLData: {},
  channelActivity: {
    activity: {
    //  serverID: {
    //    channelID: {
    //      join: 0,
    //      leave: 0,
    //      messages: 0
    //    }
    //  }
    },
    date: ''
  },
  previousChannelActivity: {},
  bans: {}, // date-time: guild ids
};

exports.get = () => {
  return user;
};
