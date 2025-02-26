const auth = require("../Controller/authController");
const axios = require('axios');
//const jwt = require('jwt-express');
require('dotenv').config({ path: require('find-config')('.env') })

jest.mock('axios');
//jest.mock('jwt-express');


const mockRequest = (tokenData) => {
    return {
      jwt: { payload: tokenData },
    };
  };

const mockRequestAuth = (mockEmail, mockPassword) => {
    return {
        body: {email: mockEmail, password: mockPassword},
    };
  };


const mockResponse = () => {
        const res = {};
        res.status = jest.fn().mockReturnValue(res);
        res.send = jest.fn().mockReturnValue(res);
        return res;
      };


const TestUser = {
    _id:            "6702f61b538284d03e48f73b",
    email:          "Test@ju.se",
    username:       "Tester",
    identifier:     0,
    description:    "",
    passowrd:       "test123",
    startingPage:   1,
    friendList: [
        {username: "Cloud",identifier: 0}
    ],
    __v: 28,
    stales: 1740165979341,
    iat: 1740165079
}
//tests if we get authenticated when logging in with a email and password
//in this test the req does not matter, instead the testUser decides if the test succedes
//also needs enviremental variables to work
describe("authenticate", () => {

    //Successful test
    test('succesful user authentication', async () => {
        axios.get.mockResolvedValue({
            data: {
                user: TestUser
            }
        });

        //Simulates input request, this will not matter however as test user decides the output
        const req = mockRequestAuth("Test@ju.se", "test123");
        const res = mockResponse();
        await auth.authenicate(req,res);
        
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith(
            expect.objectContaining( {msg: "Valid crendentials"} )
        );
    });

    //test which fails (due to the axios resolving to a failed lockup in the database)
    test('failed user authentication', async () => {
        axios.get.mockResolvedValue();

        //Simulates input request, this will not matter however as test user decides the output
        const req = mockRequestAuth("Test@ju.se", "test123");
        const res = mockResponse();
        await auth.authenicate(req,res);
        
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.send).toHaveBeenCalledWith(
            expect.objectContaining( {msg: "Bad credentials"} )
        );
    });

    //
    test('error with axios user authentication', async () => {
        axios.get.mockRejectedValue(new Error('Failed axios'));

        //Simulates input request, this will not matter however as test user decides the output
        const req = mockRequestAuth("Test@ju.se", "test123");
        const res = mockResponse();
        await auth.authenicate(req,res);
        
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.send).toHaveBeenCalledWith(
            expect.objectContaining( {msg: "Bad credentials"} )
        );
    });
});

//The function which checks if a user is logged in
describe("checkAuth", () => {
    //valid authentication
    test('Valid authentication', async () => {
        axios.get.mockResolvedValue({
            data: {
                user: TestUser
            }
        });

        //Simulates input request, this will not matter however as test user decides the output
        const req = mockRequest({email:"Test@ju.se", password:"test123"});
        const res = mockResponse();
        await auth.authStatus(req,res);
        
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith(
            expect.objectContaining( {msg: "You are authenticated"} )
        );
    });


    //failed authentication due to invalid axios
    test('Invalid authentication due to axios', async () => {
        axios.get.mockResolvedValue();

        //Simulates input request, this will not matter however as test user decides the output
        const req = mockRequest({email:"Test@ju.se", password:"test123"});
        const res = mockResponse();
        await auth.authStatus(req,res);
        
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.send).toHaveBeenCalledWith(
            expect.objectContaining( {msg: "Not authenticated"} )
        );
    });

    //failed authentication due to axios err
    test('Invalid authentication due to axios err', async () => {
        axios.get.mockRejectedValue(new Error('Failed axios'));

        //Simulates input request, this will not matter however as test user decides the output
        const req = mockRequest({email:"Test@ju.se", password:"test123"});
        const res = mockResponse();
        await auth.authStatus(req,res);
        
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.send).toHaveBeenCalledWith(
            expect.objectContaining( {msg: "Not authenticated"} )
        );
    });

    //failed authentication due to invalid payload of jwt token (i.e invalid session)
    test('Invalid authentication due to invalid jwt payload', async () => {
        axios.get.mockResolvedValue();

        //Simulates input request, this will not matter however as test user decides the output
        const req = mockRequest();
        const res = mockResponse();
        await auth.authStatus(req,res);
        
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.send).toHaveBeenCalledWith(
            expect.objectContaining( {msg: "Not authenticated"} )
        );
    });
});

describe("auth removal", () => {
    //Removed auth
    test('Remove auth by giving null token', async () => {
        //Simulates input request, this will not matter however as test user decides the output
        const req = mockRequest({email:"Test@ju.se", password:"test123"});
        const res = mockResponse();
        await auth.removeAuth(req,res);
        
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith(
            expect.objectContaining( {msg: "Logged out"} )
        );
    });
});
