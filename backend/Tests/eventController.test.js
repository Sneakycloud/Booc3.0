const eventController = require('../Controller/eventController');
const eventModel = require('../Model/eventModel');
const { sendToSocket, getSocket } = require('../Model/io_socket');
const { server } = require('../app.js');

jest.mock('../Model/eventModel');
// Mocking sockets to avoid real-time communication
jest.mock('../Model/io_socket');

// Mock request from body and token data
const mockRequest = (body, tokenData) => ({
  body,
  jwt: { payload: tokenData },
});

// Mock response with status and send methods
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

// Create test data for user and event
describe('Event Controller', () => {
  const mockUser = { username: 'User', identifier: '1234' };
  const mockEvent = {
    title: 'Event',
    date: '2025-01-01',
    fromTime: '10:00',
    toTime: '12:00',
    location: 'Location',
    description: 'Description',
    color: 'purple',
    repeat: 'none',
    visibility: 'public',
    invitePeople: [['Friend', '5678']],
  };

  // Successful test for creating an event
  test('createEvent - success', async () => {
    eventModel.createEvent.mockResolvedValue(mockEvent);
    getSocket.mockResolvedValue('mockSocket');
    sendToSocket.mockResolvedValue(true);

    const req = mockRequest(mockEvent, mockUser);
    const res = mockResponse();

    await eventController.createEvent(req, res);

    expect(eventModel.createEvent).toHaveBeenCalledWith(
      mockEvent.title,
      mockEvent.date,
      mockEvent.fromTime,
      mockEvent.toTime,
      mockEvent.location,
      mockEvent.description,
      mockEvent.color,
      mockEvent.repeat,
      mockEvent.visibility,
      [{ username: 'Friend', identifier: '5678' }],
      mockUser
    );
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalledWith({ result: mockEvent });
  });

  // Failed test for deleting an event
  test('deleteEvent - unauthorized', async () => {
    eventModel.checkIfCreator.mockResolvedValue(null);

    const req = mockRequest({ _id: 'eventId' }, mockUser);
    const res = mockResponse();

    await eventController.deleteEvent(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.send).toHaveBeenCalledWith({ msg: 'User does not have the authority to delete this event' });
  });
  
  // Successful test for deleting an event
  test('deleteEvent - success', async () => {
    eventModel.checkIfCreator.mockResolvedValue(true);
    eventModel.deleteEventModel.mockResolvedValue(true);

    const req = mockRequest({ _id: 'eventId' }, mockUser);
    const res = mockResponse();

    await eventController.deleteEvent(req, res);

    expect(eventModel.deleteEventModel).toHaveBeenCalledWith('eventId');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({ msg: 'Event Deleted' });
  });

  // Successful test for getting an event
  test('getEvents - success', async () => {
    const mockEvents = [{ title: 'Event 1' }, { title: 'Event 2' }];
    eventModel.getEvents.mockResolvedValue(mockEvents);

    const req = mockRequest({}, mockUser);
    const res = mockResponse();

    await eventController.getEvents(req, res);

    expect(eventModel.getEvents).toHaveBeenCalledWith(mockUser.username, mockUser.identifier);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({ msg: 'Got group', group: mockEvents });
  });

  // Closes the server after all tests
  afterAll((done) => {
    server.close(() => done());
  });
});