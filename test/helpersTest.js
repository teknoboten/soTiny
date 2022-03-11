const { assert} = require('chai');

const { getUserByEmail } = require('../helpers.js');


const testUsers = {
  //user database
  
    edc0abe0: {
      id: 'edc0abe0',
      email: 'Moira@jazzagals.com',
      password: 'ohdannyboy'
    },
    fe0af0c0: {
      id: 'fe0af0c0',
      email: 'alexis@alittlebit.ca',
      password: 'ewdavid'
    },
    '0323dfb2': {
      id: '0323dfb2',
      email: 'david@roseapothacary.com',
      password: 'warmestregards'
    }
  };


describe('getUserByEmail', () => {

  it('should return a user object if given a valid email', () => {
    const user = getUserByEmail("david@roseapothacary.com", testUsers);
    const expected = { id: '0323dfb2', email: 'david@roseapothacary.com', password: 'warmestregards'};
    assert.deepEqual(user, expected);
  });

  it('should return undefined if given an invalid email', () => {
    const user = getUserByEmail("bob@roseapothacary.com", testUsers);
    const expected = undefined;
    assert.equal(user, expected);
  });

});
