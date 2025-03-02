const eventController = require("../Controller/eventController");
const axios = require("axios");
const eventModel = require("../Model/eventModel");

require('dotenv').config({ path: require('find-config')('.env') });

jest.mock("axios");

jest.mock("../Model/eventModel");

const mockRequest = (sessionData, bodyData) => ({ session: sessionData, body: bodyData });

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
};

// user data for test
const TestUser = {
    username: "TestUser",
    identifier: 1,
};

// event data for test
const TestEvent = {
    _id: "12345",
    title: "Test Event",
    date: "2025-03-01",
    fromTime: "10:00",
    toTime: "12:00",
    location: "Office",
    description: "Meeting",
    color: "blue",
    repeat: "none",
    visibility: "public",
    invitePeople: [["User1", 2]],
    createdBy: TestUser,
};

describe("createEvent", () => {
    // sucessful test
    test("should successfully create an event", async () => {
        eventModel.createEvent.mockResolvedValue(TestEvent);

        const req = mockRequest({ user: TestUser }, TestEvent);
        const res = mockResponse();

        await eventController.createEvent(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.send).toHaveBeenCalledWith(expect.objectContaining({ result: expect.anything() }));
    });

    // failed test
    test("should fail to create an event due to error", async () => {
        eventModel.createEvent.mockRejectedValue(new Error("Failed to create event"));

        const req = mockRequest({ user: TestUser }, TestEvent);
        const res = mockResponse();

        await eventController.createEvent(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith(expect.objectContaining({ msg: "Failed to create event" }));
    });
});

describe("deleteEvent", () => {
    // sucessful test
    test("should successfully delete an event", async () => {
        eventModel.checkIfCreator.mockResolvedValue(true);
        eventModel.deleteEventModel.mockResolvedValue("Deleted");

        const req = mockRequest({ user: TestUser }, { _id: "12345" });
        const res = mockResponse();

        await eventController.deleteEvent(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith(expect.objectContaining({ msg: "Event Deleted" }));
    });

    // failed test due to premission
    test("should fail to delete an event due to permission error", async () => {
        eventModel.checkIfCreator.mockResolvedValue(false);

        const req = mockRequest({ user: TestUser }, { _id: "12345" });
        const res = mockResponse();

        await eventController.deleteEvent(req, res);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.send).toHaveBeenCalledWith(expect.objectContaining({ msg: "User does not have the authority to delete this event" }));
    });

    // failed test due to server
    test("should fail to delete an event due to server error", async () => {
        eventModel.deleteEventModel.mockRejectedValue(new Error("Delete request failed"));

        const req = mockRequest({ user: TestUser }, { _id: "12345" });
        const res = mockResponse();

        await eventController.deleteEvent(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith(expect.objectContaining({ msg: "Couldn't Delete Event" }));
    });
});

describe("getEvents", () => {
    // sucessful test
    test("should successfully fetch events", async () => {
        eventModel.getEvents.mockResolvedValue([TestEvent]);

        const req = mockRequest({ user: TestUser }, {});
        const res = mockResponse();

        await eventController.getEvent(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith(expect.objectContaining({ msg: "Got group", group: expect.any(Array) }));
    });

    // failed test
    test("should return unauthorized error when session is missing", async () => {
        const req = mockRequest(null, {});
        const res = mockResponse();

        await eventController.getEvent(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.send).toHaveBeenCalledWith(expect.objectContaining({ msg: "Unauthorized: No session found" }));
    });

    // failed test
    test("should fail to fetch events due to server error", async () => {
        eventModel.getEvents.mockRejectedValue(new Error("Failed to get events"));

        const req = mockRequest({ user: TestUser }, {});
        const res = mockResponse();

        await eventController.getEvent(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith(expect.objectContaining({ msg: "Failed to get events" }));
    });
});