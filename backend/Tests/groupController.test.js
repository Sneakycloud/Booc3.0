// const { server } = require('../app');
// const groupModel = require('../Model/groupModel');
// const ioSocket = require('../Model/io_socket');

// jest.mock('../Model/groupModel');
// // Mocking sockets to avoid real-time communication
// jest.mock('../Model/io_socket');

// // Test for Group Controller functionality using sockets for communication
// describe('Group Controller Tests with Sockets', () => {
//   // Successful test for getting group
//   test('getGroup - success', async () => {
//     groupModel.getGroup.mockResolvedValue({ name: 'Test Group' });
//     ioSocket.sendToSocket.mockResolvedValue({ msg: 'Got group', group: { name: 'Test Group' } });

//     const response = await ioSocket.sendToSocket('getGroup', { groupName: 'Test Group' });

//     expect(response).toEqual({ msg: 'Got group', group: { name: 'Test Group' } });
//   });
//   // Successful test for getting all groups
//   test('getAllGroups - success', async () => {
//     groupModel.getAllGroups.mockResolvedValue(['Group1', 'Group2']);
//     ioSocket.sendToSocket.mockResolvedValue({ msg: 'Got groups', groups: ['Group1', 'Group2'] });

//     const response = await ioSocket.sendToSocket('getAllGroups', {});

//     expect(response).toEqual({ msg: 'Got groups', groups: ['Group1', 'Group2'] });
//   });
//   // Successful test for creating group
//   test('createGroup - success', async () => {
//     groupModel.createGroup.mockResolvedValue(true);
//     ioSocket.sendToSocket.mockResolvedValue({ msg: 'Created group' });

//     const response = await ioSocket.sendToSocket('createGroup', { groupName: 'New Group', members: [['user1', 'id1']] });

//     expect(response).toEqual({ msg: 'Created group' });
//   });
//   // Successful test for unauthorized updating group
//   test('updateGroup - unauthorized', async () => {
//     groupModel.checkIfOwner.mockResolvedValue(false);
//     ioSocket.sendToSocket.mockResolvedValue({ msg: 'User does not have the authority to update group' });

//     const response = await ioSocket.sendToSocket('updateGroup', { currentGroupName: 'Group1', groupName: 'New Name', owners: [], members: [] });

//     expect(response).toEqual({ msg: 'User does not have the authority to update group' });
//   });
//   // Successful test for deleting group
//   test('deleteGroup - success', async () => {
//     groupModel.checkIfOwner.mockResolvedValue(true);
//     groupModel.deleteGroup.mockResolvedValue(true);
//     ioSocket.sendToSocket.mockResolvedValue({ msg: 'Deleted group' });

//     const response = await ioSocket.sendToSocket('deleteGroup', { groupName: 'Group1' });

//     expect(response).toEqual({ msg: 'Deleted group' });
//   });
// });

// // Closes the server after all tests
// afterAll(() => {
//   server.close();
// });