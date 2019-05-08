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
  username: '',
  previousUsername: {},
  discriminator: 0,
  previousDiscriminator: {},
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
  activity: {},
  previousActivity: {}
};

exports.get = () => {
  return user;
};
